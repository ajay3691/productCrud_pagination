import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateProd() {
  const [product, setProduct] = useState({
    name: '',
    code: '',
    category: '',
    image: null,
    description: '',
  });
  const [alerts, setAlerts] = useState({
    imageSizeAlert: false,
    imageFormatAlert: false,
    requiredFieldsAlert: false,
    duplicateNameAlert: false,
    duplicateCodeAlert: false,
  });
  const navigate = useNavigate();

  const updateHandler = (event) => {
    setProduct({ ...product, [event.target.name]: event.target.value });
  };

  const fileChangeHandler = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      if (selectedFile.type === 'image/jpeg' || selectedFile.type === 'image/png') {
        if (selectedFile.size <= 2 * 1024 * 1024) {
          const reader = new FileReader();

          reader.onload = () => {
            const imageDataUrl = reader.result;
            setProduct({ ...product, image: imageDataUrl });
          };

          reader.readAsDataURL(selectedFile);
        } else {
          setAlerts({ ...alerts, imageSizeAlert: true });
        }
      } else {
        setAlerts({ ...alerts, imageFormatAlert: true });
      }
    }
  };

  const clearAlerts = () => {
    setAlerts({
      imageSizeAlert: false,
      imageFormatAlert: false,
      requiredFieldsAlert: false,
      duplicateNameAlert: false,
      duplicateCodeAlert: false,
    });
  };

  const validateForm = () => {
    clearAlerts();
    if (!product.name || !product.code || !product.category || !product.image) {
      setAlerts({ ...alerts, requiredFieldsAlert: true });
      return false;
    }
    return true;
  };

  const submitHandler = (event) => {
    event.preventDefault();

    if (validateForm()) {
      axios
        .post('https://product-crud-pagination-3vxq.vercel.app/api/product', product)
        .then((resp) => {
          alert("Product Created succesfully")

          navigate('/admin');
        })
        .catch((error) => {
          console.error(error);
          if (error.response && error.response.status === 400) {
            const errorData = error.response.data;
            setAlerts({
              ...alerts,
              duplicateNameAlert: errorData.error.includes('Name already exists'),
              duplicateCodeAlert: errorData.error.includes('Code already exists'),
            });
          } else {
            alert('image must png/jpeg fomat and maximum 2 mb only.');
          }
        });
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <div className="d-flex vh-100 bg-danger justify-content-center align-items-center">
            <div className="w-50 bg-white rounded p-3">
              <form>
                <h2>Add Product</h2>
                <div className="mb-2">
                  <label htmlFor="name">Product Name</label>
                  <input
                    type="text"
                    onChange={updateHandler}
                    name="name"
                    placeholder="Enter name"
                    className="form-control"
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="code">Code</label>
                  <input
                    type="text"
                    onChange={updateHandler}
                    name="code"
                    placeholder="Enter Code"
                    className="form-control"
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="category">Category</label>
                  <select onChange={updateHandler} name="category" className="form-control">
                    <option value="">Select Category</option>
                    <option value="Category1">Category 1</option>
                    <option value="Category2">Category 2</option>
                    <option value="Category3">Category 3</option>
                  </select>
                </div>
                <div className="mb-2">
                  <label htmlFor="image">Image (PNG/JPEG, max 2MB)</label>
                  <input
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    onChange={fileChangeHandler}
                    name="image"
                    className="form-control"
                  />
                </div>
                {alerts.requiredFieldsAlert && (
                  <div className="alert alert-danger" role="alert">
                    Please fill in all required fields.
                  </div>
                )}
                {alerts.imageSizeAlert && (
                  <div className="alert alert-danger" role="alert">
                    Image size exceeds 2MB. Please choose a smaller image.
                  </div>
                )}
                {alerts.imageFormatAlert && (
                  <div className="alert alert-danger" role="alert">
                    Invalid image format. Please select a JPEG or PNG image.
                  </div>
                )}
                {alerts.duplicateNameAlert && (
                  <div className="alert alert-danger" role="alert">
                    Name already exists. Please use a different name.
                  </div>
                )}
                {alerts.duplicateCodeAlert && (
                  <div className="alert alert-danger" role="alert">
                    Code already exists. Please use a different code.
                  </div>
                )}
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  />
                )}
                <div className="mb-2">
                  <label htmlFor="description">Description</label>
                  <input
                    type="text"
                    onChange={updateHandler}
                    name="description"
                    placeholder="Enter Description"
                    className="form-control"
                  />
                </div>
                <button className="btn btn-success" onClick={submitHandler}>
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateProd;
