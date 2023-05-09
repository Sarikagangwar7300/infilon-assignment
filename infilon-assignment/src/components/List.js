import React, { useState, useEffect } from 'react';
import { Form, Popconfirm, Table, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { listData } from '../redux/action';
import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

export default function List() {
  const [form] = Form.useForm();

  let dataFromApi = useSelector((state) => state.tableListData);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listData());
  }, []);

  const [keyToEdit, setKeyToEdit] = useState('');
  const [dataSource, setDataSource] = useState(dataFromApi);

  useEffect(() => {
    if (dataFromApi) {
      setDataSource(dataFromApi);
    }
  }, [dataFromApi]);

  const handleOnClickSave = async (rowId) => {
    try {
      const row = await form.validateFields();
      const newData = [...dataSource];
      const index = newData.findIndex((item) => rowId === item.id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row
        });
        setDataSource(newData);
        setKeyToEdit('');
      } else {
        newData.push(row);
        setDataSource(newData);
        setKeyToEdit('');
      }
    } catch (error) {
      console.log('Validation Failed:', error);
    }
  };

  const handleOnClickCancel = () => {
    setKeyToEdit('');
  };

  const EditableCell = ({ editing, dataIndex, title, children, ...restProps }: any) => {
    const inputNode = <Input />;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0
            }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`
              }
            ]}>
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const handleOnClickEdit = (record) => {
    form.setFieldsValue({
      email: '',
      first_name: '',
      last_name: '',
      ...record
    });
    setKeyToEdit(record.id);
  };

  const handleOnClickDelete = (record) => {
    const newData = dataSource.filter((item) => item.id !== record.id);
    setDataSource([...newData]);
  };

  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
      editable: true,
      align: 'center'
    },
    {
      title: 'First Name',
      dataIndex: 'first_name',
      editable: true,
      align: 'center'
    },
    {
      title: 'Last Name',
      dataIndex: 'last_name',
      editable: true,
      align: 'center'
    },
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      editable: false,
      align: 'center',
      className: 'flex justify-center',
      render: (avatarImage) => <img src={avatarImage} alt="" />
    },
    {
      title: 'Action',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = record.id === keyToEdit;
        return editable ? (
          <div className="flex space-x-3">
            <CheckOutlined
              onClick={() => {
                handleOnClickSave(record.id);
              }}
              className="text-green-600 text-lg font-bold"
            />
            <Popconfirm
              title="Are you sure you want to cancel?"
              onConfirm={handleOnClickCancel}
              okType="primary"
              okText="Yes"
              cancelText="No">
              <CloseOutlined className="text-red-600 text-lg font-bold" />
            </Popconfirm>
          </div>
        ) : (
          <div className="flex space-x-3">
            <EditOutlined
              onClick={() => {
                handleOnClickEdit(record);
              }}
              className="text-blue-400 text-lg font-bold"
            />

            <Popconfirm
              title="Are you sure you want to delete?"
              onConfirm={() => handleOnClickDelete(record)}
              okType="primary"
              okText="Yes"
              cancelText="No">
              <DeleteOutlined className="text-red-600 text-lg font-bold" />
            </Popconfirm>
          </div>
        );
      }
    }
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: record.id === keyToEdit
      })
    };
  });

  return (
    <div className="App">
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell
            }
          }}
          bordered
          dataSource={dataSource}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: handleOnClickCancel
          }}
          align="center"
        />
      </Form>
    </div>
  );
}
