import React from 'react';
import {Route, Switch} from "react-router";
import HouseOwner from "./page/HouseOwner";
import Login from "./page/Login";
import Admin from "./page/Admin";

const App = () => {
    return (
        <Switch>
            <Route path="/" exact component={Login}/>
            <Route path="/admin" component={Admin}/>
            <Route path="/:accountId" component={HouseOwner}/>
        </Switch>
    );
}

export default App;
