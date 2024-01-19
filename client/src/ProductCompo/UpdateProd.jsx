import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function UpdateProd() {
  const { id } = useParams();
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

  useEffect(() => {
    axios
      .get(`https://product-crud-pagination-3vxq.vercel.app/api/product/${id}`)
      .then((resp) => {
        setProduct(resp.data.product);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const clearAlerts = () => {
    setAlerts({
      imageSizeAlert: false,
      imageFormatAlert: false,
      duplicateNameAlert: false,
      duplicateCodeAlert: false,
    });
  };

  const submitHandler = (event) => {
    event.preventDefault();

    clearAlerts();

    axios
      .put(`https://product-crud-pagination-3vxq.vercel.app/api/product/${id}`, product)
      .then((resp) => {
        alert("Product updated succesfully")
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
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <div className="d-flex vh-100 bg-danger justify-content-center align-items-center">
            <div className="w-50 bg-white rounded p-3">
              <form>
                <h2>Update Product</h2>
                <div className="mb-2">
                  <label htmlFor="name">Product Name</label>
                  <input
                    type="text"
                    onChange={updateHandler}
                    name="name"
                    value={product.name}
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
                    value={product.code}
                    placeholder="Enter Code"
                    className="form-control"
                  />
                </div>
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
                <div className="mb-2">
                  <label htmlFor="category">Category</label>
                  <select
                    onChange={updateHandler}
                    name="category"
                    value={product.category}
                    className="form-control"
                  >
                    <option value="">Select Category</option>
                    <option value="Category1">Category 1</option>
                    <option value="Category2">Category 2</option>
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
                <div className="mb-2">
                  <label htmlFor="description">Description</label>
                  <input
                    type="text"
                    onChange={updateHandler}
                    name="description"
                    value={product.description}
                    placeholder="Enter Description"
                    className="form-control"
                  />
                </div>
                <button className="btn btn-success" onClick={submitHandler}>
                  Update
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateProd;

