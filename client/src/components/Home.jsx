import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";

const Home = () => {
  const [user, setUser] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/getUser").then((res) => {
      setUser(res.data);
    });
  }, []);
  return (
    <div>
      {user.map((item) => {
        return (
          <>
            <div key={item.id}>{item.name}</div>
            <div>{item.email}</div>
            <div>{item.age}</div>
          </>
        );
      })}
    </div>
  );
};

export default Home;
