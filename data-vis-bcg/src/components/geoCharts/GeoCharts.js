import React from "react";
import { useState, useEffect } from "react";
import { ResponsiveChoropleth } from "@nivo/geo";
import { useHistory } from "react-router-dom";
import Features from "./../../mock/world_countries.json";
import netflixData from "../../mock/netflixData.json";
// import netflixData from "../../mock/netflixData2.json";
import countryCode from "../../mock/country_code.json";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import "./geoCharts.css";

const GeoCharts = () => {
  const countryWiseDistribution = {};
  const domain = [0, 1000];
  const [data, setData] = useState([]);
  const [state, setState] = useState({
    show: true,
    rating: false,
    genre: false,
  });
  const history = useHistory();

  useEffect(() => {
    domain[1] = 1;
    netflixData.map((show) => {
      show.country.split(",").map((country) => {
        let opKey = countryWiseDistribution[countryCode[country.trim()]];
        if (
          // eslint-disable-next-line no-prototype-builtins
          !countryWiseDistribution.hasOwnProperty(countryCode[country.trim()])
        ) {
          const showType = new Set();
          const showRating = new Set();
          const showDuration = {
            mins: show.duration.toLowerCase().includes("min")
              ? Number(show.duration.match(/(\d+)/)[0])
              : 0,
            seasons: show.duration.toLowerCase().includes("season")
              ? Number(show.duration.match(/(\d+)/)[0])
              : 0,
          };
          opKey = {
            showDuration,
            showTypes: showType.add(show.type),
            showRatings: showRating.add(show.rating),
            genres: new Set(show.listed_in.split(",")),
            showCount: 1,
            showList: [show],
          };
          opKey.genreCount = opKey.genres.size;
          opKey.ratingCount = opKey.showRatings.size;
        } else {
          if (show.duration.toLowerCase().includes("min")) {
            opKey.showDuration.mins += Number(show.duration.match(/(\d+)/)[0]);
          } else if (show.duration.toLowerCase().includes("season")) {
            opKey.showDuration.seasons += Number(
              show.duration.match(/(\d+)/)[0]
            );
          }
          opKey.showTypes.add(show.type);
          opKey.showRatings.add(show.rating);
          opKey.genres.add(...show.listed_in.split(","));
          opKey.showCount++;
          opKey.showList.push(show);
          opKey.genreCount = opKey.genres.size;
          opKey.ratingCount = opKey.showRatings.size;
        }
        countryWiseDistribution[countryCode[country.trim()]] = opKey;
      });
    });

    let renderData = [];
    for (let country in countryWiseDistribution) {
      let valueKey = countryWiseDistribution[country].showCount;
      if (state.show) {
        domain[1] < countryWiseDistribution[country].showCount
          ? (domain[1] =
              Math.ceil(countryWiseDistribution[country].showCount / 10.0) * 10)
          : null;
      } else if (state.genre) {
        domain[1] < countryWiseDistribution[country].genreCount
          ? (domain[1] =
              Math.ceil(countryWiseDistribution[country].genreCount / 10.0) *
              10)
          : null;
        valueKey = countryWiseDistribution[country].genreCount;
      } else if (state.rating) {
        domain[1] < countryWiseDistribution[country].ratingCount
          ? (domain[1] =
              Math.ceil(countryWiseDistribution[country].ratingCount / 10.0) *
              10)
          : null;
        valueKey = countryWiseDistribution[country].ratingCount;
      }
      renderData.push({
        id: country,
        value: valueKey,
        metadata: countryWiseDistribution[country],
      });
    }
    setData(renderData);
  }, [state]);

  const handleClick = (evt) => {
    history.push({
      pathname: "/country",
      state: { countryData: evt.data.metadata },
    });
  };

  const handleChange = (event) => {
    let toUpdate = {
      show: false,
      rating: false,
      genre: false,
    };
    toUpdate[event.target.name] = event.target.checked;
    if (!toUpdate.show && !toUpdate.rating && !toUpdate.genre) {
      toUpdate.show = true;
    }
    setState({ ...state, ...toUpdate });
  };

  return (
    <>
      <div className="filter-label">
        <FormGroup row>
          <FormControlLabel
            control={
              <Switch
                checked={state.show}
                onChange={handleChange}
                name="show"
                color="secondary"
              />
            }
            label="Number of shows"
          />
          <FormControlLabel
            control={
              <Switch
                checked={state.genre}
                onChange={handleChange}
                name="genre"
                color="secondary"
              />
            }
            label="Based on Genre"
          />
          <FormControlLabel
            control={
              <Switch
                checked={state.rating}
                onChange={handleChange}
                name="rating"
                color="secondary"
              />
            }
            label="Based on Ratings"
          />
        </FormGroup>
      </div>
      <ResponsiveChoropleth
        data={data}
        features={Features}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        colors="YlOrRd"
        domain={[0, state.show ? 1000 : 50]}
        unknownColor="#666666"
        label="properties.name"
        valueFormat=".2s"
        projectionTranslation={[0.5, 0.5]}
        projectionRotation={[0, 0, 0]}
        enableGraticule={false}
        graticuleLineColor="#dddddd"
        borderWidth={0.5}
        borderColor="#152538"
        onClick={handleClick}
        tooltip={({ feature }) => {
          return feature.data ? (
            <span className="tooltip">
              {state.show && (
                <span>
                  {feature.properties.name}: {feature.data.metadata.showCount}{" "}
                  Shows
                </span>
              )}
              {state.genre && (
                <span>
                  {feature.properties.name}: {feature.data.metadata.genreCount}
                  <br />
                  <span
                    style={{
                      width: "150px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {feature.data.metadata.genres}
                  </span>
                </span>
              )}
              {state.rating && (
                <span>
                  {feature.properties.name}: {feature.data.metadata.ratingCount}
                  <br />
                  <span
                    style={{
                      width: "150px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {feature.data.metadata.showRatings}
                  </span>
                </span>
              )}
            </span>
          ) : null;
        }}
        legends={[
          {
            anchor: "bottom-left",
            direction: "column",
            justify: true,
            translateX: 20,
            translateY: -100,
            itemsSpacing: 0,
            itemWidth: 94,
            itemHeight: 18,
            itemDirection: "left-to-right",
            itemTextColor: "#444444",
            itemOpacity: 0.85,
            symbolSize: 18,
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: "#000000",
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </>
  );
};

export default GeoCharts;
