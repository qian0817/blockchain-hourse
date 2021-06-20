import React, {useEffect, useState} from "react";
import {Account, createSelling, queryAccount, queryRealEstateList, RealEstate, Response} from "../../api";
import {useHistory, useParams} from "react-router";
import {Button, Descriptions, Drawer, Form, Image, InputNumber, message, Modal, PageHeader, Table} from "antd";
import {AxiosError} from "axios";

const RealEstateView = () => {
    const [account, setAccount] = useState<Account>();
    const [realEstateList, setRealEstateList] = useState<RealEstate[]>([]);
    const [tableLoading, setTableLoading] = useState(false);
    const [realEstateId, setRealEstateId] = useState<string>();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [detail, setDetail] = useState<RealEstate>()
    const {accountId} = useParams<{ accountId: string }>();
    const [form] = Form.useForm();
    const history = useHistory();

    const columns = [
        {
            title: '房产ID',
            dataIndex: 'realEstateId',
            key: 'realEstateId',
        },
        {
            title: '总空间',
            dataIndex: 'totalArea',
            key: 'totalArea',
        },
        {
            title: '房型',
            dataIndex: 'roomType',
            key: 'roomType',
        },
        {
            title: '地址',
            dataIndex: 'place',
            key: 'place',
        },
        {
            title: '操作',
            dataIndex: 'encumbrance',
            key: 'encumbrance',
            render: (encumbrance: boolean, record: RealEstate) => (
                <>
                    {!encumbrance ?
                        <Button onClick={() => setRealEstateId(record.realEstateId)} type="primary">出售</Button> :
                        <Button disabled>出售中</Button>
                    }
                    {
                        <Button style={{marginLeft: 8}} onClick={() => {
                            setDetail(record)
                            setModalVisible(true)
                        }}>详情</Button>
                    }
                </>
            )
        }
    ]

    useEffect(() => {
        queryAccount(accountId)
            .then(response => setAccount(response.data.data[0]))
            .catch(ex => message.warn((ex as AxiosError<Response<any>>).response?.data.msg))
        setTableLoading(true)
        queryRealEstateList(accountId)
            .then(response => setRealEstateList(response.data.data ? response.data.data : []))
            .catch(ex => message.warn((ex as AxiosError<Response<any>>).response?.data.msg))
            .finally(() => setTableLoading(false))
    }, [accountId])

    const handleSubmit = async () => {
        setModalLoading(true)
        try {
            const values = await form.validateFields()
            await createSelling(realEstateId!!, values.price, values.salePeriod, accountId)
            history.push(`/${accountId}/mySelling`)
        } catch (e) {
            message.warn((e as AxiosError<Response<any>>).response?.data.msg)
        } finally {
            setModalLoading(false)
        }
    }

    return (
        <>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title="房产信息"
            >
                <Descriptions size="small" column={3}>
                    <Descriptions.Item label="账户ID">{account?.accountId}</Descriptions.Item>
                    <Descriptions.Item label="用户名">{account?.userName}</Descriptions.Item>
                    <Descriptions.Item label="余额">￥{account?.balance}元</Descriptions.Item>
                </Descriptions>
            </PageHeader>
            <Table columns={columns} dataSource={realEstateList} loading={tableLoading}/>
            <Modal
                visible={realEstateId != null}
                confirmLoading={modalLoading}
                onOk={handleSubmit}
                onCancel={() => setRealEstateId(undefined)}>
                <Form
                    form={form}>
                    <Form.Item
                        labelCol={{span: 8}}
                        wrapperCol={{span: 16}}
                        label="价格 (元)"
                        name="price"
                        rules={[{required: true, message: '请输入价格!'}]}>
                        <InputNumber min={0} precision={2} step={100000} style={{width:240}}/>
                    </Form.Item>
                    <Form.Item
                        labelCol={{span: 8}}
                        wrapperCol={{span: 16}}
                        label="有效期（天）"
                        name="salePeriod"
                        rules={[{required: true, message: '请输入有效期!'}]}>
                        <InputNumber min={1} precision={0} style={{width:240}}/>
                    </Form.Item>
                </Form>
            </Modal>
            {
                detail && <Drawer
                    onClose={() => setModalVisible(false)}
                    visible={modalVisible}
                    width={640}>
                    <h2>{detail.place}</h2>
                    <p>房产ID:{detail.realEstateId}</p>
                    <p>总空间:{detail.totalArea}</p>
                    <p>业主ID:{detail.proprietor}</p>
                    <p>房型:{detail.roomType}</p>
                    {detail.photos.map(photo => <Image width={200} src={photo}/>)}
                </Drawer>
            }
        </>
    )
}

export default RealEstateView;