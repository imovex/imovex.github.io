import React, { useEffect } from 'react';

const NotFoundPage = () => {
  useEffect(() => {
    const path = window.location.pathname.slice(1);
    localStorage.setItem('path', path);
    window.location.href = '../';
  }, []);

  return (
    <div>
      <h1>Page Not Found</h1>
      <p>We couldn't find what you were looking for.</p>
    </div>
  );
};

export default NotFoundPage;
