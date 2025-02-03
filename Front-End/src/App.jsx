import React, { useState } from "react";
import { ethers } from "ethers";
import contractABI from "../abi.json";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const contractAddress = "0x00bb60e0c0d1b23Ac6b946f39A1CDfc246905464";

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
      toast.success(`Wallet Connected! Account: ${accounts[0]}`, { position: "top-right" });
    } else {
      toast.error("MetaMask Not Found! Please install MetaMask.", { position: "top-right" });
    }
  };

  // Register Student
  const registerStudent = async () => {
    if (!studentId || !studentName) {
      return toast.warning("Missing Details: Enter student details", { position: "top-right" });
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      
      const tx = await contract.registerStudent(studentId, studentName);
      await tx.wait();
      
      toast.success(`Student Registered! ID: ${studentId} - Name: ${studentName}`, { position: "top-right" });
      setStudentId(""); setStudentName(""); // Clear input fields
    } catch (error) {
      console.error(error);
      toast.error("Failed to register student", { position: "top-right" });
    }
  };

  // Fetch Student by ID
  const getStudentById = async () => {
    if (!studentId) {
      return toast.warning("Enter Student ID", { position: "top-right" });
    }
  
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
  
      const student = await contract.getStudentById(studentId);
      console.log(student);
      // Convert BigNumber to string for the ID
      const studentIdFormatted = student[0].toString(); // This will convert BigNumber to string
      // const studentName = student[1]; // Assuming student[1] is a string
  
      setStudentData({ id: studentIdFormatted, name: student[1] });
  
      toast.info(`Student Found! ID: ${studentIdFormatted}, Name: ${studentName}`, { position: "top-right" });
    } catch (error) {
      console.error(error);
      toast.error("Student Not Found", { position: "top-right" });
    }
  };
  

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-center text-3xl font-semibold mb-5">Kehinde Class Registration DApp</h1>

      {/* Connect Wallet Button */}
      <button 
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        onClick={connectWallet}
      >
        {account ? `Connected: ${account.substring(0, 6)}...` : "Connect Wallet"}
      </button>

      {/* Register Student */}
      <div className="mt-5 p-6 border rounded-lg shadow-lg">
        <h2 className="text-xl font-medium mb-4">Register Student</h2>
        <input 
          type="number" 
          className="w-full p-2 border rounded-md mb-4" 
          placeholder="Student ID" 
          value={studentId} 
          onChange={(e) => setStudentId(e.target.value)} 
        />
        <input 
          type="text" 
          className="w-full p-2 border rounded-md mb-4" 
          placeholder="Student Name" 
          value={studentName} 
          onChange={(e) => setStudentName(e.target.value)} 
        />
        <button 
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
          onClick={registerStudent}
        >
          Register
        </button>
      </div>

      {/* Fetch Student */}
      <div className="mt-5 p-6 border rounded-lg shadow-lg">
        <h2 className="text-xl font-medium mb-4">Get Student By ID</h2>
        <input 
          type="number" 
          className="w-full p-2 border rounded-md mb-4" 
          placeholder="Student ID" 
          value={studentId} 
          onChange={(e) => setStudentId(e.target.value)} 
        />
        <button 
          className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition"
          onClick={getStudentById}
        >
          Fetch Student
        </button>
        {studentData && (
          <div className="mt-4 p-3 bg-gray-100 rounded-md text-center">
            <h3 className="text-sm font-medium">ID: {studentData.id} Name: {studentData.name}</h3>
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
}

export default App;
