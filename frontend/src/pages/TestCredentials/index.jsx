import { ArrowRightOutlined } from '@ant-design/icons'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const testCredentials = [
    {
        email: "naruto@yopmail.com",
        password: "123"
    },
    {
        email: "gojo@yopmail.com",
        password: "123"
    },
    {
        email: "kakashi@yopmail.com",
        password: "123"
    },
    {
        email: "sasuke@yopmail.com",
        password: "123"
    },
]

const TestCredentials = () => {

    const navigate = useNavigate();

    const onClickHandler = (email, password) => {
        navigate("/login", {
            state: { email, password }
        })
    }

    return (
        <div className="transition-none w-screen h-screen p-4 flex justify-center items-center bg-dark-primary">
            <div className="w-full sm:w-[500px] max-w-[500px] border border-[#374151] bg-dark-secondary text-light-primary shadow-lg shadow-gray-500/40 rounded px-8 pt-6 pb-8 mb-4">
                <h3 className="mb-4 text-center text-xl text-light-primary font-semibold">Test Credentials</h3>

                <div className='flex flex-col gap-4'>
                    {
                        testCredentials.map(({ email, password }, index) => {
                            return (
                                <div key={index} className='flex items-center gap-8'>
                                    <p>Email:- {email}</p>
                                    <p>password:- {password}</p>
                                    <ArrowRightOutlined
                                        className='text-2xl text-blue-500 cursor-pointer hover:translate-x-2'
                                        onClick={() => onClickHandler(email, password)}
                                    />
                                </div>
                            )
                        })
                    }
                </div>

                <Link to="/login" className="mt-4 inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 border-b border-blue-500 hover:border-blue-800">
                    Login
                </Link>
            </div>
        </div>
    )
}

export default TestCredentials