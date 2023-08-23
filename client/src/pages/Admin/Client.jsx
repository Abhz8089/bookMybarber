import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";

import AdminNav from "../../components/Admin/AdminNav";
import SubNav from "../../components/Admin/SubNav";
import { useAdminData } from "../../contexts/userContexts";
import { logoutAdmin } from "../../globelContext/adminSlice";

import styles from "./styles/Beautician.module.css";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Client = () => {
  const dispatch = useDispatch()
  const { adminData, setAdminData } = useAdminData();
  const Navigate = useNavigate();
  const cusotmStyles = {
    headRow: {
      style: {
        backgroundColor: "black",
        color: "white",
      },
    },
    headCells: {
      style: {
        fontSize: "16px",
        fontWeight: "600",
        textTransform: "uppercase",
      },
    },
    cells: {
      style: {
        fontSize: "15px",
      },
    },
  };

  const column = [
    {
      name: "Sl. No.",
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.userName,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => {
        const date = new Date(row.createdAt);
        return date.toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      },
      sortable: true,
    },
   
    {
      name: "Access",
      selector: (row) => row.isBlock,

      cell: (row) => (
        <div>
          {/* {row.access ? "Allowed" : "Denied"} */}
          <button
            className={row.isBlock ? styles.greenButton:styles.redButton }
            onClick={() => handleButtonClick(row._id)}
          >
            {row.isBlock ? "unblock" : "block"}
          </button>
        </div>
      ),
    },
  ];

  const handleButtonClick = async (id) => {
    Swal.fire({
      title: "Confirmation",
      text: "Are you sure you want to change the access?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33", 
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          let { data } = await axios.post("/ad/update-client-access", { id });
          console.log(data);
          if (data.error) {
            toast.error(data.error);
          } else {
            
            setRecords(data);
          }
        } catch (error) {
          console.log(error);
          toast.error("Something went wrong");
        }

        Swal.fire({
          title: "Access Updated",
          text: "Access has been updated successfully!",
          icon: "success",
        });
      }
    });
  };

  useEffect(() => {
  

    async function getShop() {
      try {
        const { data } = await axios.get("/ad/clients");

        if (data.error) {
          toast.error(data.error);
        }
        if (data.message) {
          {
            dispatch((logoutAdmin()))
            Navigate("/ad/admin");
          }
        }
        setRecords(data);
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong");
      }
    }

    getShop();

   
  }, []);

  const [records, setRecords] = useState([]);

  return (
    <>
      <AdminNav />
      <SubNav />
      <div style={{ padding: "50px 10%" }}>
        <DataTable
          columns={column}
          data={records}
          customStyles={cusotmStyles}
          pagination
        />
      </div>
    </>
  );
};

export default Client;
