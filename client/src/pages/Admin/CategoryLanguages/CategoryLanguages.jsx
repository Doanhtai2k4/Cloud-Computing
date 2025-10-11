import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  message,
  Card,
  Tag,
  Select,
  Image,
  Upload // Import Upload component
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TagOutlined,
  UploadOutlined // Import UploadOutlined icon
} from '@ant-design/icons';
import axios from 'axios';
import styles from './CategoryLanguages.module.css';

const API_URL = import.meta.env.VITE_API;

const CategoryLanguagesAdmin = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]); // State để quản lý file đã chọn bởi Ant Design Upload

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/v1/category/categoryLanguages`);
      if (response.data.success) {
        setCategories(response.data.data || []);
      }
    } catch (error) {
      message.error('Lỗi khi tải danh sách danh mục');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/brand/brandLanguages`);
      if (response.data.success) {
        setBrands(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  // Hàm chuyển đổi file thành Base64
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      // Kiểm tra file có phải là Blob/File không
      const actualFile = file.originFileObj || file;
      if (!actualFile || typeof actualFile.size === 'undefined') {
        reject(new Error('Invalid file object'));
        return;
      }
      
      const reader = new FileReader();
      reader.readAsDataURL(actualFile);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleSubmit = async (values) => {
    console.log('=== SUBMIT DEBUG ===');
    console.log('Form values:', values);
    console.log('File list:', fileList);
    console.log('Editing category:', editingCategory);
    console.log('API URL:', API_URL);

    try {
      let imageCBase64 = null;
      
      if (fileList.length > 0) {
        console.log('Converting file to base64...');
        console.log('File object:', fileList[0]);
        
        const currentFile = fileList[0];
        
        // Nếu có originFileObj thì là file mới được chọn
        if (currentFile.originFileObj) {
          console.log('New file detected, converting to base64...');
          imageCBase64 = await getBase64(currentFile.originFileObj);
          console.log('Base64 converted, length:', imageCBase64?.length);
        } else if (currentFile.url) {
          // Nếu có url thì là ảnh cũ được load để preview
          console.log('Using existing image URL/base64');
          imageCBase64 = currentFile.url;
        } else {
          console.log('Invalid file object');
        }
      } else if (editingCategory && editingCategory.imageC) {
        // Fallback: sử dụng ảnh từ editingCategory
        imageCBase64 = editingCategory.imageC;
        console.log('Using existing image from editingCategory');
      } else {
        console.log('No image provided - this will cause validation error');
      }

      console.log('Final imageCBase64:', imageCBase64?.substring(0, 50) + '...');

      const payload = {
        ...values,
        brandLanguages: values.brandLanguages,
        imageC: imageCBase64 // Gửi chuỗi Base64
      };

      console.log('Final payload:', payload);

      if (editingCategory) {
        // Update
        console.log('Updating category...');
        const response = await axios.put(`${API_URL}/api/v1/category/categoryLanguages/${editingCategory.slug}`, payload);
        console.log('Update response:', response.data);
        message.success('Cập nhật danh mục thành công');
      } else {
        // Create
        console.log('Creating new category...');
        console.log('API endpoint:', `${API_URL}/api/v1/category/categoryLanguage`);
        const response = await axios.post(`${API_URL}/api/v1/category/categoryLanguage`, payload);
        console.log('Create response:', response.data);
        message.success('Tạo danh mục thành công');
      }

      setModalVisible(false);
      setEditingCategory(null);
      form.resetFields();
      setFileList([]); // Reset file list sau khi submit
      fetchCategories();
    } catch (error) {
      console.error('=== ERROR DEBUG ===');
      console.error('Error object:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Full error details:', JSON.stringify(error.response?.data, null, 2));
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    form.setFieldsValue({
      nameC: category.nameC,
      descriptionC: category.descriptionC,
      brandLanguages: category.brandLanguages?._id || category.brandLanguages,
      // Khi chỉnh sửa, nếu có ảnh, set nó vào fileList để hiển thị preview
      // (Không set vào trường form vì Upload không quản lý giá trị qua form.setFieldsValue trực tiếp)
    });
    // Set fileList cho Upload component để hiển thị ảnh hiện tại
    if (category.imageC) {
      setFileList([
        {
          uid: '-1', // Unique ID cho file, Ant Design cần
          name: 'current_image.png', // Tên hiển thị
          status: 'done', // Trạng thái của file
          url: category.imageC, // URL (hoặc Base64) để Ant Design hiển thị preview
        },
      ]);
    } else {
      setFileList([]); // Reset nếu không có ảnh cũ
    }
    setModalVisible(true);
  };

  const handleDelete = async (slug) => {
    try {
      await axios.delete(`${API_URL}/api/v1/category/categoryLanguages/${slug}`);
      message.success('Xóa danh mục thành công');
      fetchCategories();
    } catch (error) {
      message.error('Lỗi khi xóa danh mục');
    }
  };

  // Props cho Upload component
  const uploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
      form.setFieldsValue({ imageC: undefined }); // Xóa giá trị imageC trong form khi remove
    },
    beforeUpload: (file) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('Bạn chỉ có thể tải lên file JPG/PNG!');
        return Upload.LIST_IGNORE; // Ngăn không cho file được thêm vào danh sách
      }
      const isLt2M = file.size / 1024 / 1024 < 2; // Giới hạn 2MB
      if (!isLt2M) {
        message.error('Ảnh phải nhỏ hơn 2MB!');
        return Upload.LIST_IGNORE;
      }
      
      // Tạo file object cho Ant Design
      const fileObj = {
        uid: file.uid || Date.now().toString(),
        name: file.name,
        status: 'done',
        originFileObj: file,
      };
      
      setFileList([fileObj]); // Set với cấu trúc Ant Design
      return false; // Ngăn Ant Design Upload tự động upload
    },
    fileList,
    listType: "picture-card", // Hiển thị dưới dạng thẻ ảnh
    maxCount: 1, // Chỉ cho phép tải lên 1 ảnh
  };


  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'imageC',
      key: 'imageC',
      width: 120,
      render: (imageC) => (
        imageC ? ( // Kiểm tra xem imageC có tồn tại không
          <Image
            style={{ cursor: 'pointer', objectFit: 'cover', borderRadius: '4px' }}
            src={imageC}
            alt="Category Image"
            width={64}
            height={64}
            preview={true}
          />
        ) : (
          <div style={{ width: 64, height: 64, border: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bfbfbf', fontSize: '12px' }}>
            Không ảnh
          </div>
        )
      )
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'nameC',
      key: 'nameC',
      sorter: (a, b) => a.nameC.localeCompare(b.nameC),
      render: (name) => <strong>{name}</strong>
    },
    {
      title: 'Mô tả',
      dataIndex: 'descriptionC',
      key: 'descriptionC',
      ellipsis: true,
      render: (desc) => desc || <span style={{ color: '#ccc' }}>Chưa có mô tả</span>
    },
    {
      title: 'Thương hiệu',
      dataIndex: 'brandLanguages',
      key: 'brandLanguages',
      render: (brand) => (
        brand ? (
          <Tag color="blue" icon={<TagOutlined />}>
            {brand.nameBrand || brand}
          </Tag>
        ) : (
          <Tag color="default">Chưa gán</Tag>
        )
      )
    },

    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa danh mục này?"
            onConfirm={() => handleDelete(record.slug)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className={styles.categoryLanguages}>
      <Card>
        <div className={styles.header}>
          <div>
            <h2>Quản lý Category Languages</h2>
            <p>Quản lý các danh mục ngôn ngữ lập trình</p>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingCategory(null);
              form.resetFields();
              setFileList([]); // Reset file list khi thêm mới
              setModalVisible(true);
            }}
          >
            Thêm danh mục
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={categories}
          rowKey="_id"
          loading={loading}
          pagination={{
            pageSize: 7,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} danh mục`
          }}
          className={styles.table}
        />

        <Modal
          title={editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            setEditingCategory(null);
            form.resetFields();
            setFileList([]); // Reset file list khi hủy
          }}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className={styles.form}
          >
            <Form.Item
              name="nameC"
              label="Tên danh mục"
              rules={[
                { required: true, message: 'Vui lòng nhập tên danh mục' },
                { min: 2, message: 'Tên danh mục phải có ít nhất 2 ký tự' }
              ]}
            >
              <Input placeholder="Nhập tên danh mục" />
            </Form.Item>

            <Form.Item
              name="descriptionC"
              label="Mô tả danh mục"
              rules={[
                { max: 500, message: 'Mô tả không được vượt quá 500 ký tự' }
              ]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Nhập mô tả cho danh mục"
                showCount
                maxLength={500}
              />
            </Form.Item>

            {/* THAY THẾ TRƯỜNG IMAGEC BẰNG UPLOAD COMPONENT */}
            <Form.Item
              name="imageC" // Giữ name để Ant Design Form quản lý state
              label="Ảnh danh mục"
              rules={[
                {
                  required: !editingCategory, // Chỉ required khi tạo mới
                  message: 'Vui lòng tải lên ảnh danh mục'
                }
              ]}
            >
              <Upload {...uploadProps}>
                {fileList.length < 1 && ( // Chỉ hiển thị nút upload nếu chưa có ảnh
                  <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
                )}
              </Upload>
            </Form.Item>


            <Form.Item
              name="brandLanguages"
              label="Thương hiệu"
              rules={[
                { required: true, message: 'Vui lòng chọn thương hiệu' }
              ]}
            >
              <Select
                placeholder="Chọn thương hiệu"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {brands.map(brand => (
                  <Select.Option key={brand._id} value={brand._id}>
                    {brand.nameBrand}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item className={styles.formActions}>
              <Space>
                <Button
                  onClick={() => {
                    setModalVisible(false);
                    setEditingCategory(null);
                    form.resetFields();
                    setFileList([]); // Reset file list khi hủy
                  }}
                >
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit">
                  {editingCategory ? 'Cập nhật' : 'Tạo mới'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default CategoryLanguagesAdmin;