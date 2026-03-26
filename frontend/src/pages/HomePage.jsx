import { useRef } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'

import { ToastContainer, toast } from 'react-toastify';
import { useAuthStore } from "../store/authStore";

import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

const HomePage = () => {

    const [form, setform] = useState({ site: "", username: "", password: "" })
    const [passwordArray, setpasswordArray] = useState([])

    const user = useAuthStore((state) => state.user);

    const getPasswords = async () => {
        if (!user) return;
        try {
            const res = await axios.get(`http://localhost:3000/?uid=${user.uid}`);
            setpasswordArray(res.data.data);
        } catch (error) {
            console.log("Error fetching passwords", error);
        }
    };

    useEffect(() => {
        getPasswords()
    }, [user])

    const ref = useRef()
    const passwordRef = useRef()

    const copyText = (text) => {
        toast('Copied to clipboard!', { theme: "dark" });
        navigator.clipboard.writeText(text)
    }

    const showPassword = () => {
        passwordRef.current.type = "text"
        if (ref.current.src.includes("/eyecross.png")) {
            passwordRef.current.type = "text"
            ref.current.src = "/eye.png";
        } else {
            ref.current.src = "/eyecross.png"
            passwordRef.current.type = "password"
        }
    }

    const savePassword = async () => {
        if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {
            try {
                let res;
                const payload = { ...form, uid: user.uid };

                if (form.id) {
                    res = await axios.put(`http://localhost:3000/update/${form.id}`, payload);
                    const updatedArray = passwordArray.map(item =>
                        item.id === form.id ? { id: form.id, ...res.data.result } : item
                    );
                    setpasswordArray(updatedArray);
                    toast("Password Updated!", { theme: "dark" });
                } else {
                    res = await axios.post("http://localhost:3000/save", payload);
                    setpasswordArray([...passwordArray, res.data.result]);
                    toast("Password Saved!", { theme: "dark" });
                }

                setform({ site: "", username: "", password: "" });

            } catch (error) {
                console.log("Error saving", error);
            }
        } else {
            toast('Minimum Length Required is 3!', { theme: "dark" });
        }
    };

    const editPassword = (id) => {
        const selected = passwordArray.find(item => item.id === id);
        setform(selected);
    };

    const deletePassword = async (id) => {
        let confirmDelete = confirm("Do You Really Want to Delete this Password?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:3000/delete/${id}`);
            setpasswordArray(passwordArray.filter(item => item.id !== id));
            toast('Password Deleted', { theme: "dark" });
        } catch (error) {
            console.log("Error deleting", error);
        }
    };

    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }

    return (
        <>
            <ToastContainer theme="light" />
            <ToastContainer />

            <div className="absolute inset-0 -z-10 h-full w-full bg-green-100 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
                <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d5c5ff,transparent)]"></div>
            </div>

            <div className="w-full flex justify-center px-3 sm:px-4">
                <div className="w-full max-w-[1550px] min-h-[88vh] py-4">

                    <h1 className='font-bold text-xl sm:text-2xl md:text-3xl text-center'>
                        <span className='text-green-500'>&lt;</span>
                        Pass
                        <span className='text-green-500'>OP/&gt;</span>
                    </h1>

                    <div className='text-white flex flex-col p-3 sm:p-4 gap-4 sm:gap-5'>
                        <input
                            value={form.site}
                            onChange={handleChange}
                            placeholder='Enter Website URL'
                            className='border border-green-800 bg-white rounded-full text-black px-4 py-2 text-sm sm:text-base'
                            type="text"
                            name='site'
                        />

                        <div className="flex flex-col md:flex-row w-full gap-4 md:gap-8">
                            <input
                                value={form.username}
                                onChange={handleChange}
                                placeholder='Enter Username'
                                className='w-full border border-green-800 bg-white text-black rounded-full px-4 py-2 text-sm sm:text-base'
                                type="text"
                                name='username'
                            />

                            <div className='relative w-full'>
                                <input
                                    ref={passwordRef}
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder='Enter Password'
                                    className='w-full border border-green-800 bg-white text-black rounded-full px-4 py-2 text-sm sm:text-base'
                                    type="password"
                                    name='password'
                                />
                                <span className='absolute top-1/2 -translate-y-1/2 right-3'>
                                    <img
                                        ref={ref}
                                        className='cursor-pointer w-5 sm:w-6'
                                        src="/eyecross.png"
                                        alt=""
                                        onClick={showPassword}
                                    />
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={savePassword}
                            className='text-black flex justify-center items-center mx-auto bg-green-600 rounded-full cursor-pointer gap-2 px-5 sm:px-6 py-2 text-sm sm:text-base hover:bg-green-500 hover:font-semibold'
                        >
                            <lord-icon src="https://cdn.lordicon.com/gzqofmcx.json" trigger="hover"></lord-icon>
                            Save
                        </button>
                    </div>

                    <div className='passwords px-2 sm:px-3 md:px-5'>
                        <h2 className='font-bold text-lg sm:text-xl py-4'>Your Passwords</h2>

                        {passwordArray.length === 0 && <div>No Passwords to Show</div>}

                        {passwordArray.length !== 0 && (
                            <div className="overflow-x-auto">
                                <table className="table-auto w-full rounded-md overflow-hidden mb-20 text-xs sm:text-sm md:text-base">
                                    <thead className='bg-green-800 text-white'>
                                        <tr>
                                            <th className='py-2 px-2'>Site</th>
                                            <th className='py-2 px-2'>Username</th>
                                            <th className='py-2 px-2'>Password</th>
                                            <th className='py-2 px-2'>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody className='bg-green-100'>
                                        {passwordArray.map((item, index) => (
                                            <tr key={index}>
                                                <td className='border border-white py-2 text-center'>
                                                    <div className='flex justify-center items-center gap-2 sm:gap-4 flex-wrap'>
                                                        <a href={item.site} target='_blank'>{item.site}</a>
                                                        <img className='cursor-pointer w-4' src="/copy.png" alt="" onClick={() => copyText(item.site)} />
                                                    </div>
                                                </td>

                                                <td className='border border-white py-2 text-center'>
                                                    <div className='flex justify-center items-center gap-2 sm:gap-4 flex-wrap'>
                                                        {item.username}
                                                        <img className='cursor-pointer w-4' src="/copy.png" alt="" onClick={() => copyText(item.username)} />
                                                    </div>
                                                </td>

                                                <td className='border border-white py-2 text-center'>
                                                    <div className='flex justify-center items-center gap-2 sm:gap-4 flex-wrap'>
                                                        {item.password}
                                                        <img className='cursor-pointer w-4' src="/copy.png" alt="" onClick={() => copyText(item.password)} />
                                                    </div>
                                                </td>

                                                <td className='border border-white py-2 text-center'>
                                                    <div className='flex justify-center items-center gap-2 sm:gap-3'>
                                                        <div className='cursor-pointer' onClick={() => editPassword(item.id)}>
                                                            <lord-icon className='w-5 sm:w-6' src="https://cdn.lordicon.com/exymduqj.json" trigger="hover"></lord-icon>
                                                        </div>
                                                        <div className='cursor-pointer' onClick={() => deletePassword(item.id)}>
                                                            <lord-icon className='w-5 sm:w-6' src="https://cdn.lordicon.com/jzinekkv.json" trigger="hover"></lord-icon>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </>
    )
}

export default HomePage