import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import ModeOutlinedIcon from "@mui/icons-material/ModeOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Button } from "@material-ui/core";
import Modal from "react-modal";
import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import { Pagination, PaginationItem } from "@mui/material";
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
function CustomPagination() {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <Pagination
      style={{ marginRight: "auto", marginLeft: "auto", color: "gray" }}
      color="primary"
      variant="outlined"
      shape="rounded"
      showFirstButton
      showLastButton
      page={page + 1}
      count={pageCount}
      // @ts-expect-error
      renderItem={(props2) => <PaginationItem {...props2} disableRipple />}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
}

function App() {
  const [data, setData] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [selectionModel, setSelectionModel] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const hanldeSelectedData = (id) => {
    setIsOpen(true);
    const dt = data.filter((item) => {
      return item.id === id;
    });
    setId(dt[0].id);
    setName(dt[0].name);
    setEmail(dt[0].email);
    setRole(dt[0].role);
  };
  const getData = async () => {
    const dumData = await axios.get(
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
    );
    setData(dumData.data);
  };
  useEffect(() => {
    getData();
  }, []);
  const columns = [
    {
      field: "name",
      headerName: "Name",
      minWidth: 150,
      flex: 0.5,
      editable: true,
      headerAlign: "left",
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 200,
      flex: 0.5,
    },

    {
      field: "role",
      headerName: "Role",
      type: "number",
      minWidth: 150,
      flex: 0.5,
      headerAlign: "left",
      align: "left",
    },

    {
      field: "actions",
      flex: 0.5,
      headerName: "Actions",
      minWidth: 150,
      type: "number",
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) => {
        return (
          <div>
            <ModeOutlinedIcon
              onClick={() =>
                hanldeSelectedData(params.getValue(params.id, "id"))
              }
            />

            <DeleteOutlineOutlinedIcon
              style={{ color: "red", marginLeft: "20px" }}
              onClick={() =>
                deleteUserHandler(params.getValue(params.id, "id"))
              }
            />
          </div>
        );
      },
    },
  ];

  const rows = [];
  const deleteUserHandler = (id) => {
    let dt = data.filter((user) => {
      return user.id !== id;
    });
    setData(dt);
  };

  data &&
    data.forEach((item) => {
      rows.push({
        id: item.id,
        role: item.role,
        email: item.email,
        name: item.name,
      });
    });
  useEffect(() => {
    data &&
      data.forEach((item) => {
        rows.push({
          id: item.id,
          role: item.role,
          email: item.email,
          name: item.name,
        });
      });
  }, [data]);
  const hanldeAllDataDelete = () => {
    const selectedIDs = new Set(selectionModel);
    setData((r) => r.filter((item) => !selectedIDs.has(item.id)));
  };

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  function closeModal() {
    setIsOpen(false);
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    const newState = data.map((obj) => {
      if (obj.id === id) {
        return { ...obj, name: name, email: email, role: role };
      }
      return obj;
    });
    setData(newState);
    setIsOpen(false);
  };
  return (
    <div>
      <div className="App">
        <input
          type="text"
          style={{ width: "98%", padding: "10px" }}
          placeholder="Search by name , email or role"
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
        />
        <DataGrid
          rows={rows.filter((row) => {
            if (searchUser === "") return rows;
            else if (
              row.name.includes(searchUser) ||
              row.email.includes(searchUser) ||
              row.role.includes(searchUser)
            ) {
              return row;
            }
          })}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
          components={{
            Pagination: CustomPagination,
          }}
          checkboxSelection
          onSelectionModelChange={(ids) => {
            setSelectionModel(ids);
          }}
          editMode="row"
        />
        <Button onClick={hanldeAllDataDelete}>Delete Selected</Button>
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <h2 style={{ textAlign: "center" }}>Update Data</h2>
          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <label style={{ marginRight: "10px" }}>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <label style={{ marginRight: "10px" }}>Email</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <label style={{ marginRight: "10px" }}>Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button className="btn-save" type="submit">
                SAVE
              </button>
              <button
                onClick={closeModal}
                className="btn-close"
              >
                CLOSE
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}

export default App;
