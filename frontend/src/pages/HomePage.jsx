import { useRef } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'

import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import axios from "axios";





const HomePage = () => {

    const [form, setform] = useState({ site: "", username: "", password: "" })

    const [passwordArray, setpasswordArray] = useState([])

    const getPasswords = async () => {
        try {
            const res = await axios.get("http://localhost:3000/");
            setpasswordArray(res.data.data);
        } catch (error) {
            console.log("Error fetching passwords", error);
        }
    };

    useEffect(() => {
        getPasswords()

    }, [])



    const ref = useRef()
    const passwordRef = useRef()


    const copyText = (text) => {
        toast('Copied to clipboard!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });

        navigator.clipboard.writeText(text)

    }

    const showPassword = () => {
        passwordRef.current.type = "text"
        if (ref.current.src.includes("/eyecross.png")) {
            passwordRef.current.type = "text"

            ref.current.src = "/eye.png";


        }
        else {
            ref.current.src = "/eyecross.png"
            passwordRef.current.type = "password"

        }
    }
    const savePassword = async () => {
        if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {

            try {
                let res;

                // If editing
                if (form.id) {
                    res = await axios.put(`http://localhost:3000/update/${form.id}`, form);

                    // Replace updated password in UI
                    const updatedArray = passwordArray.map(item =>
                        item.id === form.id ? { id: form.id, ...res.data.result } : item
                    );
                    setpasswordArray(updatedArray);

                    toast("Password Updated!", { theme: "dark" });
                }

                // If adding new
                else {
                    res = await axios.post("http://localhost:3000/save", form);
                    setpasswordArray([...passwordArray, res.data.result]);
                    toast("Password Saved!", { theme: "dark" });
                }

                // Reset form
                setform({ site: "", username: "", password: "" });

            } catch (error) {
                console.log("Error saving", error);
            }

        } else {
            toast('Minimum Length Required is 3!', { theme: "dark" });
        }
    };




    const deletePassword = async (id) => {
        let confirmDelete = confirm("Do You Really Want to Delete this Password?");

        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:3000/delete/${id}`);

            setpasswordArray(passwordArray.filter(item => item.id !== id));

            toast('Password Deleted', {
                theme: "dark",
            });

        } catch (error) {
            console.log("Error deleting", error);
        }
    };



    const editPassword = (id) => {
        const selected = passwordArray.find(item => item.id === id);
        setform(selected);
    };







    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }


    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition="Bounce"
            />
            {/* Same as */}
            <ToastContainer />

            <div className="absolute inset-0 -z-10 h-full  w-full bg-green-100 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"><div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d5c5ff,transparent)]"></div></div>

            <div className="p-4 md:mycontainer min-h-[88vh]">


                <h1 className='font-bold text-2xl text-center'>

                    <span className='text-green-500'>

                        &lt;
                    </span>
                    Pass

                    <span className='text-green-500'>
                        OP/&gt;
                    </span>


                </h1>

                <div className='text-white flex flex-col p-4 gap-5' >
                    <input value={form.site} onChange={handleChange} placeholder='Enter Website URL' className='border border-green-800 bg-white rounded-full text-black p-4 py-1 my-1' type="text" name='site' />

                    <div className="flex flex-col md:flex-row w-full gap-8">

                        <input value={form.username} onChange={handleChange} placeholder='Enter Username' className='w-full border border-green-800  bg-white text-black rounded-full p-4 py-1' type="text" name='username' />

                        <div className='relative w-full '>


                            <input ref={passwordRef} value={form.password} onChange={handleChange} placeholder='Enter Password' className='w-full border border-green-800 bg-white text-black rounded-full p-4 py-1' type="password" name='password' />
                            <span className='absolute top-0 right-0 text-black'>
                                <img ref={ref} className='p-1 m-1 cursor-pointer  ' width={25} src="/eyecross.png" alt="" onClick={showPassword} /></span>

                        </div>


                    </div>


                    <button onClick={savePassword} className='text-black flex justify-center items-center transition-all mx-auto bg-green-500 rounded-full cursor-pointer gap-2 px-6 py-2 w-fit hover:bg-green-400 hover:font-bold'>

                        <lord-icon
                            src="https://cdn.lordicon.com/gzqofmcx.json"
                            trigger="hover">
                        </lord-icon>
                        Save</button>


                </div>


                <div className='passwords px-3 md:px-5'>
                    <h2 className='font-bold text-xl py-4'>Your Passwords</h2>
                    {passwordArray.length === 0 && <div>No Passwords to Show</div>}

                    {passwordArray.length != 0 && <table className="table-auto w-full rounded-md overflow-hidden mb-22  ">
                        <thead className='bg-green-800 text-white'>
                            <tr>
                                <th className='py-2'>Site</th>
                                <th className='py-2'>Username</th>
                                <th className='py-2'>Password</th>
                                <th className='py-2'>Action</th>
                            </tr>
                        </thead>
                        <tbody className='bg-green-100'>
                            {passwordArray.map((item, index) => {
                                return <tr key={index}>
                                    <td className=' border border-white py-2 text-center w-32'>
                                        <div className='flex justify-center items-center gap-4'>
                                            <a href={item.site} target='_blank'>{item.site}</a>

                                            <img className=' copypng cursor-pointer w-4' src="/copy.png" alt="" onClick={() => copyText(item.site)} />

                                        </div>
                                    </td>

                                    <td className='border border-white py-2 text-center w-32'>
                                        <div className='flex justify-center items-center gap-4'>
                                            {item.username}

                                            <img className=' copypng cursor-pointer w-4' src="/copy.png" alt="" onClick={() => copyText(item.username)} />

                                        </div>
                                    </td>
                                    <td className=' border border-white py-2 text-center w-32'>
                                        <div className='flex justify-center items-center gap-4'>
                                            {item.password}

                                            <img className='copypng cursor-pointer w-4' src="/copy.png" alt="" onClick={() => copyText(item.password)} />

                                        </div>
                                    </td>

                                    <td className=' border border-white py-2 text-center w-32'>
                                        <div className='flex justify-center items-center gap-3'>
                                            <div className='cursor-pointer' onClick={() => editPassword(item.id)}><script src="https://cdn.lordicon.com/lordicon.js"></script>
                                                <lord-icon className='w-6 py-1'
                                                    src="https://cdn.lordicon.com/exymduqj.json"
                                                    trigger="hover"
                                                    stroke="bold"
                                                    state="hover-line">
                                                </lord-icon></div>
                                            <div className='cursor-pointer' onClick={() => deletePassword(item.id)}><script src="https://cdn.lordicon.com/lordicon.js"></script>
                                                <lord-icon className='w-6 py-1' src="https://cdn.lordicon.com/jzinekkv.json"
                                                    trigger="hover"
                                                    stroke="bold"
                                                >
                                                </lord-icon></div>

                                        </div>
                                    </td>
                                </tr>


                            })}




                        </tbody>
                    </table>}

                </div>
            </div>




        </>
    )
}

export default HomePage


