import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const { name, email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      setError('');
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.msg || data.error || 'Registration failed');
        return;
      }
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      navigate('/dashboard');
    } catch (err) {
      console.error('Register error', err);
      setError('Registration failed — please try again');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 mx-auto">
          <div className="card">
            <div className="card-body">
              <h2 className="text-center">Register</h2>
              <form onSubmit={onSubmit}>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" className="form-control" name="name" value={name} onChange={onChange} required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" className="form-control" name="email" value={email} onChange={onChange} required />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" className="form-control" name="password" value={password} onChange={onChange} required />
                </div>
                <button type="submit" className="btn btn-primary btn-block">Register</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
