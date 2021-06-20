import React, {useEffect, useState} from "react";
import {Button, Descriptions, Drawer, Image, message, PageHeader, Table} from "antd";
import {Account, queryAccount, querySellingList, Response, Selling, updateSelling} from "../../api";
import {useParams} from "react-router";
import {AxiosError} from "axios";

const MySelling = () => {
    const [account, setAccount] = useState<Account>();
    const [mySelling, setMySelling] = useState<Selling[]>();
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [detail, setDetail] = useState<Selling>();
    const {accountId} = useParams<{ accountId: string }>();

    useEffect(() => {
        queryAccount(accountId).then(response => setAccount(response.data.data[0]))
            .catch(ex => message.warn((ex as AxiosError<Response<any>>).response?.data.msg))
        querySellingList(accountId).then(response => setMySelling(response.data.data))
            .catch(ex => message.warn((ex as AxiosError<Response<any>>).response?.data.msg))
    }, [accountId])

    const cancelSell = async (objectOfSale: string, buyer: string = "") => {
        try {
            await updateSelling(buyer, objectOfSale, accountId, "cancelled")
            const response = await querySellingList(accountId)
            setMySelling(response.data.data)
        } catch (e) {
            message.warn((e as AxiosError<Response<any>>).response?.data.msg)
        }
    }

    const confirmSell = async (objectOfSale: string, buyer: string) => {
        try {
            await updateSelling(buyer, objectOfSale, accountId, 'done')
            const response = await querySellingList(accountId)
            setMySelling(response.data.data)
        } catch (e) {
            message.warn((e as AxiosError<Response<any>>).response?.data.msg)
        }
    }

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
            title: '价格',
            dataIndex: 'price',
            key: 'price'
        },
        {
            title: '地址',
            dataIndex: 'place',
            key: 'place'
        },
        {
            title: '有效期',
            dataIndex: 'salePeriod',
            key: 'salePeriod',
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime'
        },
        {
            title: '购买者ID',
            dataIndex: 'buyer',
            key: 'buyer',
        },
        {
            title: '操作',
            dataIndex: 'sellingStatus',
            key: 'sellingStatus',
            render: (sellingStatus: string, selling: Selling) => {
                return (
                    <>
                        {selling.sellingStatus === '销售中' &&
                        <Button onClick={() => cancelSell(selling.objectOfSale)} danger>取消销售</Button>}
                        {selling.sellingStatus === '交付中' &&
                        <Button
                            onClick={() => confirmSell(selling.objectOfSale, selling.buyer)}
                            type="primary">确认收款</Button>}
                        {selling.sellingStatus === '交付中' &&
                        <Button
                            style={{marginLeft: 8}}
                            onClick={() => cancelSell(selling.objectOfSale, selling.buyer)}
                            danger>取消</Button>}
                        <Button style={{marginLeft: 8}} onClick={() => {
                            setDetail(selling)
                            setDrawerVisible(true)
                        }}>详情</Button>
                    </>
                )
            }
        }
    ]

    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title="出售记录"
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
                    closable={true}
                    placement="right"
                    width={640} visible={drawerVisible}>
                    <h2>{detail.place}</h2>
                    <p>销售者ID:{detail.seller}</p>
                    <p>房产ID：{detail.objectOfSale}</p>
                    <p>状态：{detail.sellingStatus}</p>
                    <p>总价：{detail.price}</p>
                    <p>总面积：{detail.totalArea}</p>
                    <p>房型：{detail.roomType}</p>
                    <p>发布时间：{detail.createTime}</p>
                    {detail.photos.map(photo => <Image width={200} src={photo}/>)}
                </Drawer>
            }
        </div>
    )
}

export default MySelling