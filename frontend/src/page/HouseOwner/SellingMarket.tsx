import React, {useEffect, useState} from "react";
import {Button, Descriptions, Drawer, Image, Input, InputNumber, message, PageHeader, Table} from "antd";
import {Account, createSellingByBuy, queryAccount, querySellingList, Response, Selling} from "../../api";
import {useHistory, useParams} from "react-router";
import {AxiosError} from "axios";

const SellingMarket = () => {
    const [account, setAccount] = useState<Account>();
    const [allSelling, setAllSelling] = useState<Selling[]>([]);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [drawerInfo, setDrawerInfo] = useState<Selling>();
    const {accountId} = useParams<{ accountId: string }>();
    const [searchName, setSearchName] = useState("");
    const [minTotal, setMinTotal] = useState(0);
    const [maxTotal, setMaxTotal] = useState(10000000000);
    const [minPercent, setMinPercent] = useState(0);
    const [maxPercent, setMaxPercent] = useState(10000000);
    const history = useHistory();

    useEffect(() => {
        queryAccount(accountId)
            .then(response => setAccount(response.data.data[0]))
            .catch(ex => message.warn((ex as AxiosError<Response<any>>).response?.data.msg))
        querySellingList()
            .then(response => response.data.data ? response.data.data : [])
            .then(data => data.filter(selling => selling.seller !== accountId && selling.sellingStatus === '销售中'))
            .then(response => setAllSelling(response))
            .catch(ex => message.warn((ex as AxiosError<Response<any>>).response?.data.msg))
    }, [accountId])

    const columns = [
        {
            title: '房产ID',
            dataIndex: 'objectOfSale',
            key: 'objectOfSale',
        },
        {
            title: '销售者ID',
            dataIndex: 'seller',
            key: 'seller',
        },
        {
            title: '总价',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => <>{price}元</>,
            sorter: (a: Selling, b: Selling) => a.price - b.price
        },
        {
            title: "单价",
            dataIndex: "price",
            key: "percent",
            render: (_: any, record: Selling) => <>{record.price / record.totalArea}元/m<sup>2</sup></>,
            sorter: (a: Selling, b: Selling) => a.price / a.totalArea - b.price / b.totalArea
        },
        {
            title: "总面积",
            dataIndex: "totalArea",
            key: "totalArea",
            render: (totalArea: number) => <>{totalArea}m<sup>2</sup></>,
            sorter: (a: Selling, b: Selling) => a.totalArea - b.totalArea
        },
        {
            title: '地址',
            dataIndex: 'place',
            key: 'place',
        },
        {
            title: '有效期',
            dataIndex: 'salePeriod',
            key: 'salePeriod',
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
        },
        {
            title: "操作",
            dataIndex: 'sellingStatus',
            key: 'sellingStatus',
            render: (_: any, record: Selling) => <>
                <Button onClick={() => buy(record.objectOfSale, record.seller)}>购买</Button>
                <Button style={{marginLeft: 8}} onClick={() => {
                    setDrawerInfo(record);
                    setDrawerVisible(true)
                }}>详情</Button>
            </>
        }
    ]

    const buy = async (objectOfSale: string, seller: string) => {
        try {
            await createSellingByBuy(accountId, objectOfSale, seller);
            history.push(`/${accountId}/mySellingBuy`);
        } catch (e) {
            message.warn((e as AxiosError<Response<any>>).response?.data.msg)
        }
    }

    return (
        <>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title="房产市场">
                <Descriptions column={3}>
                    <Descriptions.Item label="账户ID">{account?.accountId}</Descriptions.Item>
                    <Descriptions.Item label="用户名">{account?.userName}</Descriptions.Item>
                    <Descriptions.Item label="余额">￥{account?.balance}元</Descriptions.Item>
                </Descriptions>
            </PageHeader>
            <div style={{paddingTop: 16, paddingBottom: 16, background: "white"}}>
                <h2 style={{marginLeft: 16}}>搜索</h2>
                <div style={{marginTop: 8}}>
                    <span style={{marginLeft: 16}}>地址：</span>
                    <Input
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        style={{width: 300, marginLeft: 8}}/>
                </div>
                <div style={{marginTop: 8}}>
                    <span style={{marginLeft: 16}}>总价范围：</span>
                    <InputNumber
                        value={minTotal}
                        onChange={setMinTotal}
                        style={{width: 300, marginLeft: 8, marginRight: 8}}/>
                    ~
                    <InputNumber
                        value={maxTotal}
                        onChange={setMaxTotal}
                        style={{width: 300, marginLeft: 8, marginRight: 8}}/>
                    元
                </div>
                <div style={{marginTop: 8}}>
                    <span style={{marginLeft: 16}}>单价范围：</span>
                    <InputNumber
                        value={minPercent}
                        onChange={setMinPercent}
                        style={{width: 300, marginLeft: 8, marginRight: 8}}/>
                    ~
                    <InputNumber
                        value={maxPercent}
                        onChange={setMaxPercent}
                        style={{width: 300, marginLeft: 8, marginRight: 8}}/>
                    元/m<sup>2</sup>
                </div>
            </div>

            <Table columns={columns}
                   dataSource={
                       allSelling
                           .filter(it => it.place.indexOf(searchName) !== -1
                               && it.price <= maxTotal
                               && it.price >= minTotal
                               && it.price / it.totalArea >= minPercent
                               && it.price / it.totalArea <= maxPercent)}/>
            {
                drawerInfo && <Drawer
                    onClose={() => setDrawerVisible(false)}
                    closable={true}
                    placement="right"
                    width={640} visible={drawerVisible}>
                    <h2>{drawerInfo.place}</h2>
                    <p>销售者ID:{drawerInfo.seller}</p>
                    <p>房产ID：{drawerInfo.objectOfSale}</p>
                    <p>总价：{drawerInfo.price}</p>
                    <p>总面积：{drawerInfo.totalArea}</p>
                    <p>房型：{drawerInfo.roomType}</p>
                    <p>发布时间：{drawerInfo.createTime}</p>
                    {drawerInfo.photos.map(photo => <Image width={200} src={photo}/>)}
                </Drawer>
            }
        </>
    )
}

export default SellingMarket;
