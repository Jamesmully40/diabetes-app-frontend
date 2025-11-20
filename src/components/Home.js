import React from 'react';

const Home = () => {
  return (
    <div className="container mt-5">
      <div className="jumbotron">
        <h1 className="display-4">Welcome to Diabetes Monitor</h1>
        <p className="lead">Monitor your diabetes and get AI-powered recommendations to improve your health.</p>
        <hr className="my-4" />
        <p>Join us in the fight against diabetes by donating to support our cause.</p>
        <a className="btn btn-primary btn-lg" href="/donate" role="button">Donate Now</a>
      </div>
    </div>
  );
};
export default Home;