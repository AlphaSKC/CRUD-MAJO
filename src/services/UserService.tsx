import axios from "axios";

const getUsers = async () => {
    try{
        const response = await axios.get('http://localhost:5104/Usuarios');
        return response.data.result;
    }
    catch(e){
        console.error(e);
    }
}

const createUser = async (user: any) => {
    try {
        const response = await axios.post('http://localhost:5104/Usuarios', user);
        return response.data;
    } catch (e) {
        console.error(e);
    }
}

const deleteUser = async (id: number) => {
    try {
        const response = await axios.delete(`http://localhost:5104/Usuarios/${id}`);
        return response.data;
    } catch (e) {
        console.error(e);
    }
}

const updateUser = async (user: any) => {
    try {
        const response = await axios.put(`http://localhost:5104/Usuarios/${user.pkUsuario}`, user);
        return response.data;
    } catch (e) {
        console.error(e);
    }
}

export { getUsers, createUser, deleteUser, updateUser}