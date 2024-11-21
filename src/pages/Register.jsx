import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth, db } from "../components/firebase";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import "../css/Register.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      console.log(user);
      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: fname,
          lastName: lname,
        });
      }
      console.log("User Registered Successfully!!");
      toast.success("User Registered Successfully!!", {
        position: "top-center",
      });
    } catch (error) {
      console.log(error.message);
      toast.error(error.message, {
        position: "bottom-center",
      });
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleRegister} className="register-form">
        <h3 className="register-title">Sign Up</h3>

        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            className="form-input"
            placeholder="First name"
            onChange={(e) => setFname(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            className="form-input"
            placeholder="Last name"
            onChange={(e) => setLname(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            className="form-input"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="form-input"
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn-submit">
          Sign Up
        </button>
        <p className="register-footer">
          Already registered? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
};

export default Register;
