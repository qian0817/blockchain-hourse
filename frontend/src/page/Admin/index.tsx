import React from "react";
import {Button, Layout, Menu} from "antd";
import {Route, Switch, useHistory} from "react-router";
import UserManager from "./UserManager";
import RealEstateView from "../HouseOwner/RealEstateView";
import SellingMarket from "../HouseOwner/SellingMarket";
import MySellingBuy from "../HouseOwner/MySellingBuy";
import MySelling from "../HouseOwner/MySelling";

const {Content, Header, Sider} = Layout;

const Admin = () => {
    const history = useHistory()
    return (
        <>
            <Layout>
                <Header style={{color: 'white'}}>
                    基于区块链的房地产交易系统
                </Header>
            </Layout>
            <Layout>
                <Sider width={200}>
                    <Menu mode="inline" style={{height: '100vh'}}>
                        <Menu.Item key="1" onClick={() => history.push(`/admin/userManager`)}>用户管理</Menu.Item>
                        <Menu.Item key="5" onClick={() => history.push('/')}>登出</Menu.Item>
                    </Menu>
                </Sider>
                <Content style={{padding: '24 24px', minHeight: 280}}>
                    <Switch>
                        <Route path="/admin/userManager" component={UserManager}/>
                    </Switch>
                </Content>
            </Layout>
            <Button onClick={() => history.push('/')}>登出</Button>
        </>
    )
}

export default Admin;