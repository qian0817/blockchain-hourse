import React from "react";
import {Route, Switch, useHistory, useParams} from "react-router";
import {Layout, Menu} from "antd";
import RealEstateView from "./RealEstateView";
import SellingMarket from "./SellingMarket";
import MySellingBuy from "./MySellingBuy";
import MySelling from "./MySelling";

const {Content, Header, Sider} = Layout;

const HouseOwner = () => {
    const {accountId} = useParams<{ accountId: string }>();
    const history = useHistory()
    return (
        <Layout>
            <Header style={{color: 'white'}}>
                基于区块链的房地产交易系统
            </Header>
            <Layout>
                <Sider width={200}>
                    <Menu mode="inline" style={{height: '100vh'}}>
                        <Menu.Item key="1" onClick={() => history.push(`/${accountId}/realEstate`)}>我的房产</Menu.Item>
                        <Menu.Item key="2" onClick={() => history.push(`/${accountId}/market`)}>房产市场</Menu.Item>
                        <Menu.Item key="3" onClick={() => history.push(`/${accountId}/mySellingBuy`)}>购买记录</Menu.Item>
                        <Menu.Item key="4" onClick={() => history.push(`/${accountId}/mySelling`)}>出售记录</Menu.Item>
                        <Menu.Item key="5" onClick={() => history.push('/')}>登出</Menu.Item>
                    </Menu>
                </Sider>
                <Content style={{padding: '24 24px', minHeight: 280}}>
                    <Switch>
                        <Route path="/:accountId/realEstate" component={RealEstateView}/>
                        <Route path="/:accountId/market" component={SellingMarket}/>
                        <Route path="/:accountId/mySellingBuy" component={MySellingBuy}/>
                        <Route path="/:accountId/mySelling" component={MySelling}/>
                    </Switch>
                </Content>
            </Layout>
        </Layout>
    )
}

export default HouseOwner