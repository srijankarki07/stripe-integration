"use client";
import { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const [loadingIndex, setLoadingIndex] = useState(null);

  const totalPages = Math.ceil(products.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const checkout = async (item, index) => {
    try {
      setLoadingIndex(index); // Set the loading index for the current item

      const response = await axios.post("/api/payment", {
        items: [
          {
            name: item.title,
            price: item.price,
          },
        ],
      });

      const url = response.data.url;

      if (url) {
        window.location.href = url;
      } else {
        console.error("Checkout URL not found in response.");
      }
    } catch (error) {
      console.error("Error checking out:", error);
    } finally {
      setLoadingIndex(null); // Reset loading index
    }
  };

  const renderStars = (rate) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        style={{ color: i < Math.floor(rate) ? "gold" : "#9E9E9E" }}
      >
        ★
      </span>
    ));
  };

  return (
    <ProductStyled>
      <h2>Just For You</h2>
      <div className="container">
        {currentProducts.map((item, index) => (
          <div key={item.id} className="product-card">
            <div className="image-container">
              <img
                src={item.image}
                alt={item.title}
                width={"100%"}
                height={"100%"}
              />
            </div>
            <div className="details">
              <div className="title" style={{ color: "black" }}>
                {item.title}
              </div>
              <div className="price">Rs.{item.price.toFixed(2)}</div>
              <div className="rating">
                {renderStars(item.rating.rate)} /({item.rating.count})
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "5px",
              }}
            >
              <button
                onClick={() => checkout(item, index)}
                disabled={loadingIndex === index}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "green",
                  width: "50px",
                  height: "30px",
                  padding: "15px",
                  borderRadius: "8px",
                }}
              >
                {loadingIndex === index ? "Loading..." : "Pay"}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
    </ProductStyled>
  );
}

const ProductStyled = styled.div`
  margin: 30px;
  h2 {
    font-size: 32px;
    margin-bottom: 20px;
    color: #424242;
  }
  .container {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
  .product-card {
    width: 190px;
    height: 350px;
    background: white;
    border-radius: 10px;
    .image-container {
      width: 190px;
      height: 190px;
      overflow: hidden;
      border-radius: 10px 10px 0 0;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
  }
  .product-card:hover {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }
  .details {
    display: flex;
    flex-direction: column;
    width: 190px;
    padding: 4px 8px 12px;
    margin-top: 20px;
    .title {
      height: 36px;
      width: 176px;
      overflow: hidden;
      font-size: 15px;
      color: #212121;
      margin-bottom: 8px;
      font-weight: bold;
    }
    .price {
      font-size: 18px;
      color: #f58606;
    }
    .rating {
      width: 176px;
      height: 14px;
      color: #9e9e9e;
      font-size: 14px;
    }
  }
  .pagination {
    display: flex;
    justify-content: right;
    margin: 20px 150px 0 0;
  }
  .pagination button {
    margin: 0 5px;
    padding: 10px 15px;
    border: none;
    background-color: #fff;
    border-radius: 5px;
    border: 1px solid #d9d9d9;
    cursor: pointer;
  }
  .pagination button.active {
    border-radius: 5px;
    background-color: #f58606;
    color: white;
  }
  @media (max-width: 786px) {
    .container {
      grid-template-columns: repeat(2, 1fr);
    }
    .product-card {
      width: 175px;
      height: 240px;
      background: white;
      border-radius: 10px;
      .image-container {
        width: 175px;
        height: 130px;
        overflow: hidden;
        border-radius: 10px 10px 0 0;
        img {
          width: 95%;
          height: 95%;
          object-fit: contain;
        }
      }
    }
    .details {
      .title {
        height: 16px;
        width: 130px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
`;
