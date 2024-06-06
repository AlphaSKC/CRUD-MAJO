import { AccountCircle } from '@mui/icons-material';
import NumbersIcon from '@mui/icons-material/Numbers';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PasswordIcon from '@mui/icons-material/Password';
import { Box, Button, Typography, Modal, TextField, InputAdornment, Alert, Snackbar } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { createUser, getUsers, updateUser, deleteUser } from '../services/UserService';

interface Users {
    pkUsuario: number;
    nombre: string;
    user: string;
    password: string;
    fkRol: number;
}

const CustomTextField = styled(TextField)({
    '& label': {
        color: '#FFF',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#FFF',
        },
        '&:hover fieldset': {
            borderColor: '#d65fe8',
        },
        '& input': {
            color: '#FFF',
        },
    },
    '& .MuiInputAdornment-root': {
        color: '#FFF',
    },
});

export default function UsersList() {
    const [rows, setRows] = useState<Users[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<Users | null>(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await getUsers();
            setRows(data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleEdit = (user: Users) => {
        setSelectedUser(user);
        handleOpen();
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteUser(id);
            setAlertMessage('¡Usuario eliminado exitosamente!');
            setAlertSeverity('success');
            setAlertOpen(true);
            await fetchData();
        } catch (e) {
            console.error(e);
            setAlertMessage('Error al eliminar el usuario');
            setAlertSeverity('error');
            setAlertOpen(true);
        }
    };

    const handleAdd = () => {
        setSelectedUser({ pkUsuario: 0, nombre: '', user: '', fkRol: 0, password: '' });
        handleOpen();
    };

    const handleSave = async () => {
        if (selectedUser) {
            if (selectedUser.pkUsuario) {
                try {
                    await updateUser(selectedUser);
                    await fetchData();
                    setAlertMessage('¡Usuario actualizado exitosamente!');
                    setAlertOpen(true);
                } catch (e) {
                    console.error(e);
                }
            } else {
                try {
                    await createUser(selectedUser);
                    await fetchData();
                    setAlertMessage('¡Usuario creado exitosamente!');
                    setAlertOpen(true);
                } catch (e) {
                    console.error(e);
                }
            }
        }
        handleClose();
    };

    const columns: GridColDef[] = [
        { field: 'pkUsuario', headerName: 'ID', width: 90, align: 'center', headerAlign: 'center' },
        {
            field: 'nombre',
            headerName: 'Nombre',
            width: 150,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'user',
            headerName: 'Usuario',
            width: 150,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'fkRol',
            headerName: 'ID Rol',
            width: 150,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'actions',
            headerName: 'Acciones',
            width: 200,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <strong>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleEdit(params.row)}
                        style={{ marginRight: 8 }}
                    >
                        <EditIcon />
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(params.row.pkUsuario)}
                    >
                        <DeleteIcon />
                    </Button>
                </strong>
            ),
        },
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof Users) => {
        if (selectedUser) {
            setSelectedUser({
                ...selectedUser,
                [field]: field === 'fkRol' ? parseInt(e.target.value, 10) : e.target.value,
            });
        }
    };

    const handleAlertClose = () => {
        setAlertOpen(false);
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '25px',
            marginLeft: 'auto',
            marginRight: 'auto',
        }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
                margin: '20px',
            }}>
                <Typography variant="h4" component="h1">
                    Lista de usuarios
                </Typography>
                <Button variant="contained" color="secondary" onClick={handleAdd}>
                    Crear usuario
                </Button>
            </Box>
            <DataGrid
                rows={rows}
                columns={columns}
                getRowId={(row) => row.pkUsuario}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 5,
                        },
                    },
                }}
                pageSizeOptions={[5]}
            />

            <Modal open={open} onClose={handleClose}>
                <Box
                    component="form"
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        background: 'linear-gradient(to right, #13072E, #3F2182)',
                        border: '2px solid #FFF',
                        borderRadius: '20px',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginBottom: '5px',
                    }}>
                        <Typography variant="h6" component="h2" sx={{
                            color: '#FFF',
                            fontWeight: 'bold',
                        }}>
                            {selectedUser?.pkUsuario ? 'Editar usuario' : 'Crear usuario'}
                        </Typography>
                    </Box>
                    <CustomTextField
                        label="Nombre"
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <DriveFileRenameOutlineIcon />
                                </InputAdornment>
                            ),
                        }}
                        color='secondary'
                        variant="outlined"
                        margin="normal"
                        value={selectedUser?.nombre || ''}
                        onChange={(e) => handleChange(e, 'nombre')}
                    />
                    <CustomTextField
                        label="Usuario"
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AccountCircle />
                                </InputAdornment>
                            ),
                        }}
                        color='secondary'
                        variant="outlined"
                        margin="normal"
                        value={selectedUser?.user || ''}
                        onChange={(e) => handleChange(e, 'user')}
                    />
                    <CustomTextField
                        label="Contraseña"
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PasswordIcon />
                                </InputAdornment>
                            ),
                        }}
                        color='secondary'
                        variant="outlined"
                        margin="normal"
                        value={selectedUser?.password || ''}
                        onChange={(e) => handleChange(e, 'password')}
                    />
                    <CustomTextField
                        label="Rol"
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <NumbersIcon />
                                </InputAdornment>
                            ),
                        }}
                        color='secondary'
                        variant="outlined"
                        margin="normal"
                        value={selectedUser?.fkRol || ''}
                        onChange={(e) => handleChange(e, 'fkRol')}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <Button variant="contained" color="secondary" onClick={handleSave}>
                            Guardar
                        </Button>
                    </Box>
                </Box>
            </Modal>
            <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleAlertClose}>
                <Alert onClose={handleAlertClose} severity={alertSeverity} sx={{ width: '100%' }}>
                    {alertMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}
