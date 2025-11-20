import React, { useState } from 'react';

const Donate = () => {
  const [formData, setFormData] = useState({
    phone: '',
    amount: ''
  });
  const [message, setMessage] = useState(null);

  const { phone, amount } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    // Call the backend endpoint to initiate STK push
    try {
      // normalize phone: allow 07... or 2547... or +2547...
      let normalized = phone.trim();
      if (normalized.startsWith('0')) normalized = '254' + normalized.slice(1);
      if (normalized.startsWith('+')) normalized = normalized.slice(1);

      const res = await fetch('/api/donations/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token') // if you store token in localStorage
        },
        body: JSON.stringify({ phone: normalized, amount })
      });
      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || data.Message || 'Payment initiation failed' });
      } else {
        // Daraja returns CheckoutRequestID - user should get an STK prompt on their phone
        setMessage({ type: 'success', text: 'Payment request sent. Enter your M-Pesa PIN when prompted on your phone.' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Unable to initiate payment. Try again later.' });
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 mx-auto">
          <div className="card">
            <div className="card-body">
              <h2 className="text-center">Donate</h2>
              <p className="text-center">Your donation will help us fight diabetes.</p>
              <form onSubmit={onSubmit}>
                {message && (
                  <div className={`alert ${message.type === 'error' ? 'alert-danger' : 'alert-success'}`}>{message.text}</div>
                )}
                <div className="form-group">
                  <label>Phone Number (e.g., 2547...)</label>
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    value={phone}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Amount (KES)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="amount"
                    value={amount}
                    onChange={onChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block">Donate Now</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;