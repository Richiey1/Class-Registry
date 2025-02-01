import React, { useState } from "react";
import { ethers } from "ethers";
import { Container, Typography, Button, TextField, Card, CardContent } from "@mui/material";
import contractABI from "../abi.json";
import "./App.css";



const contractAddress = "0x00bb60e0c0d1b23Ac6b946f39A1CDfc246905464"; 


// 
function App() {
  const [account, setAccount] = useState(null);
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentData, setStudentData] = useState(null);

  // Connect to MetaMask Wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
    } else {
      alert("Please install MetaMask!");
    }
  };

  // Register Student
  const registerStudent = async () => {
    if (!studentId || !studentName) return alert("Enter student details");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    try {
      const tx = await contract.registerStudent(studentId, studentName);
      await tx.wait();
      alert("Student Registered Successfully!");
    } catch (error) {
      console.error(error);
      alert("Error registering student");
    }
  };

  // Fetch Student by ID
  const getStudentById = async () => {
    if (!studentId) return alert("Enter student ID");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    try {
      const student = await contract.getStudentById(studentId);
      setStudentData({ id: student[0], name: student[1] });
    } catch (error) {
      console.error(error);
      alert("Student not found");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ textAlign: "center", my: 3 }}> Kehinde Class Registration DApp</Typography>
      
      <Button variant="contained" color="primary" fullWidth onClick={connectWallet}>
        {account ? `Connected: ${account.substring(0, 6)}...` : "Connect Wallet"}
      </Button>

      <Card sx={{ mt: 3, p: 2 }}>
        <CardContent>
          <Typography variant="h6">Register Student</Typography>
          <TextField fullWidth label="Student ID" type="number" margin="normal" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
          <TextField fullWidth label="Student Name" margin="normal" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
          <Button variant="contained" color="secondary" fullWidth onClick={registerStudent}>Register</Button>
        </CardContent>
      </Card>

      <Card sx={{ mt: 3, p: 2 }}>
        <CardContent>
          <Typography variant="h6">Get Student By ID</Typography>
          <TextField fullWidth label="Student ID" type="number" margin="normal" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
          <Button variant="contained" color="success" fullWidth onClick={getStudentById}>Fetch Student</Button>
          {studentData && (
            <Typography sx={{ mt: 2 }}>ID: {studentData.id}, Name: {studentData.name}</Typography>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}

export default App;
