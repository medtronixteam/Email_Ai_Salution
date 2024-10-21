import React, { useEffect } from "react";

const NotFound = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = "/";
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  const styles = {
    container: {
      textAlign: "center",
      marginTop: "50px",
      color: "white",
      fontFamily: "Arial, sans-serif",

      padding: "20px",
      borderRadius: "10px",
    },
    heading: {
      fontSize: "48px",
      marginBottom: "20px",
    },
    message: {
      fontSize: "20px",
    },
    link: {
      fontSize: "18px",
      textDecoration: "underline",
      color: "white",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Oops! 404 - Page Not Found</h1>
      <p style={styles.message}>
        It seems the page you're looking for doesn't exist.
      </p>
      <p style={styles.message}>Redirecting to the home page in 6 seconds...</p>
      <p style={styles.link}>
        Or{" "}
        <a href="/" style={styles.link}>
          click here
        </a>{" "}
        to go back now.
      </p>
    </div>
  );
};

export default NotFound;
