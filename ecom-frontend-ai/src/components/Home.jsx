import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppContext from "../Context/Context";
import unplugged from "../assets/unplugged.png";

const Home = ({ selectedCategory }) => {
  const { data, isError, addToCart, refreshData } = useContext(AppContext);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastProduct, setToastProduct] = useState(null);

  useEffect(() => {
    if (!isDataFetched) {
      refreshData();
      setIsDataFetched(true);
    }
  }, [refreshData, isDataFetched]);

  useEffect(() => {
    console.log(data, 'data from home page');
  }, [data]);

  useEffect(() => {
    let toastTimer;
    if (showToast) {
      toastTimer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
    return () => clearTimeout(toastTimer);
  }, [showToast]);

  // Function to get product image URL or fallback
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const getProductImageSrc = (product) => {
    // If productImage exists and is valid, use it
    if (product.productImage) {
      if (product.productImage.startsWith('data:') || product.productImage.startsWith('http')) {
        return product.productImage;
      }
      // Assume base64 string
      return `data:image/jpeg;base64,${product.productImage}`;
    }
    // If imageName exists, construct image URL
    if (product.imageName) {
      return `${baseUrl}/api/product/${product.id}/image`;
    }
    // Fallback image
    return unplugged;
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    addToCart(product);
    setToastProduct(product);
    setShowToast(true);
  };

  const filteredProducts = selectedCategory
    ? data.filter((product) => product.category === selectedCategory)
    : data;

  if (isError) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="text-center">
          <img src={unplugged} alt="Error" className="img-fluid" width="100" />
          <h4 className="mt-3">Something went wrong</h4>
        </div>
      </div>
    );
  }
  
  return (
    <>
      {/* Toast Notification */}
      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
        <div 
          className={`toast ${showToast ? 'show' : 'hide'}`}
          role="alert" 
          aria-live="assertive" 
          aria-atomic="true"
        >
          <div className="toast-header bg-success text-white">
            <strong className="me-auto">Added to Cart</strong>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={() => setShowToast(false)}
              aria-label="Close"
            ></button>
          </div>
          <div className="toast-body">
            {toastProduct && (
              <div className="d-flex align-items-center">
                <img 
                  src={getProductImageSrc(toastProduct)} 
                  alt={toastProduct.name} 
                  className="me-2 rounded" 
                  width="40" 
                  height="40"
                  onError={(e) => {
                    e.target.src = unplugged; // Fallback image
                  }}
                />
                <div>
                  <div className="fw-bold">{toastProduct.name}</div>
                  <small>Successfully added to your cart!</small>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mt-5 pt-5">
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {!filteredProducts || filteredProducts.length === 0 ? (
            <div className="col-12 text-center my-5">
              <h4>No Products Available</h4>
            </div>
          ) : (
            filteredProducts.map((product) => {
              const { id, brand, name, price, productAvailable, productImage, stockQuantity } = product;
              
              return (
                <div className="col" key={id}>
                  <div className={`card h-100 shadow-sm ${!productAvailable ? 'bg-light' : ''}`}>
                    <Link to={`/product/${id}`} className="text-decoration-none text-dark">
                      <img
                        src={getProductImageSrc(product)}
                        alt={name}
                        className="card-img-top p-2"
                        style={{ height: "150px", objectFit: "cover" }}
                        onError={(e) => {
                          e.target.src = unplugged; // Fallback image if conversion fails
                        }}
                      />
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title">{name.toUpperCase()}</h5>
                        <p className="card-text text-muted fst-italic">~ {brand}</p>
                        <hr />
                        <div className="mt-auto">
                          <h5 className="mb-2 fw-bold">
                            <i className="bi bi-currency-rupee"></i>{price}
                          </h5>
                          <button
                            className="btn btn-primary w-100"
                            onClick={(e) => handleAddToCart(e, product)}
                            disabled={!productAvailable || stockQuantity === 0}
                          >
                            {stockQuantity !== 0 ? "Add to Cart" : "Out of Stock"}
                          </button>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default Home;