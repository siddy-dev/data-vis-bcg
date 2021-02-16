import React from "react";
import GeoCharts from "./components/geoCharts/GeoCharts";
import CountryData from "./components/countryData/CountryData";
import NotFoundPage from "./components/notFound/NotFoundPage";
import { Switch, Route, Redirect } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/">
          <GeoCharts />
        </Route>
        <Route path="/country">
          <CountryData />
        </Route>
        <Route path="/404" component={NotFoundPage} />
        <Redirect to="/404" />
      </Switch>
    </div>
  );
}

export default App;
