import React, {useEffect, useState} from "react";
import {Button, Descriptions, Drawer, Image, message, PageHeader, Table} from "antd";
import {Account, queryAccount, querySellingListByBuyer, Response, Selling, SellingBuy} from "../../api";
import {useParams} from "react-router";
import {AxiosError} from "axios";

const MySellingBuy = () => {
    const [detail, setDetail] = useState<SellingBuy>();
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [account, setAccount] = useState<Account>();
    const [mySelling, setMySelling] = useState<SellingBuy[]>()
    const {accountId} = useParams<{ accountId: string }>();

    useEffect(() => {
        queryAccount(accountId)
            .then(response => setAccount(response.data.data[0]))
            .catch(ex => message.warn((ex as AxiosError<Response<any>>).response?.data.msg))
        querySellingListByBuyer(accountId)
            .then(response => setMySelling(response.data.data))
            .catch(ex => message.warn((ex as AxiosError<Response<any>>).response?.data.msg))
    }, [accountId])

    const columns = [
        {
            title: '下单时间',
            dataIndex: 'createTime',
            key: 'createTime',
        },
        {
            title: '房产ID',
            dataIndex: 'selling',
            key: 'selling',
            render: (selling: Selling) => selling.objectOfSale
        },
        {
            title: '销售者ID',
            dataIndex: 'selling',
            key: 'selling',
            render: (selling: Selling) => selling.seller
        },
        {
            title: '地址',
            dataIndex: 'selling',
            key: 'selling',
            render: (selling: Selling) => selling.place
        },
        {
            title: '价格',
            dataIndex: 'selling',
            key: 'selling',
            render: (selling: Selling) => selling.price,
            sorter: (a: SellingBuy, b: SellingBuy) => a.selling.price - b.selling.price
        },
        {
            title: '有效期',
            dataIndex: 'selling',
            key: 'selling',
            render: (selling: Selling) => selling.salePeriod
        },
        {
            title: '创建时间',
            dataIndex: 'selling',
            key: 'selling',
            render: (selling: Selling) => selling.createTime
        },
        {
            title: '购买者ID',
            dataIndex: 'buyer',
            key: 'buyer',
        },
        {
            title: "状态",
            dataIndex: "selling",
            key: "selling",
            render: (selling: Selling) => selling.sellingStatus
        },
        {
            title: "详情",
            dataIndex: "selling",
            key: "selling",
            render: ((_: Selling, record: SellingBuy) => <Button onClick={() => {
                setDetail(record)
                setDrawerVisible(true)
            }}>详情</Button>)
        }
    ]

    return (
        <>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title="购买记录"
            >
                <Descriptions size="small" column={3}>
                    <Descriptions.Item label="账户ID">{account?.accountId}</Descriptions.Item>
                    <Descriptions.Item label="用户名">{account?.userName}</Descriptions.Item>
                    <Descriptions.Item label="余额">￥{account?.balance}元</Descriptions.Item>
                </Descriptions>
            </PageHeader>
            <Table columns={columns} dataSource={mySelling}/>
            {
                detail && <Drawer
                    onClose={() => setDrawerVisible(false)}
                    width={640}
                    visible={drawerVisible}>
                    <h2>{detail.selling.place}</h2>
                    <p>购买时间:{detail.createTime}</p>
                    <p>状态:{detail.selling.sellingStatus}</p>
                    <p>销售者ID:{detail.selling.seller}</p>
                    <p>购买者ID:{detail.buyer}</p>
                    <p>总空间:{detail.selling.totalArea}</p>
                    <p>房型:{detail.selling.roomType}</p>
                    <p>价格:{detail.selling.price}</p>
                    <p>房产ID:{detail.selling.objectOfSale}</p>
                    {detail.selling.photos.map(photo => <Image width={200} src={photo}/>)}
                </Drawer>
            }
        </>
    )
}

export default MySellingBuy