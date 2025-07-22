import { Button } from '@/components/ui/button'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Error = () => {
    const navigate = useNavigate()
    return (
        <div className="flex justify-center">
            <div className='flex flex-col gap-5 items-center text-center pt-20 text-3xl font-semibold'>
                404 Not Found
                <Button type='button' onClick={() => navigate("/")}>Back To Home</Button>
            </div>
        </div>
    )
}

export default Error