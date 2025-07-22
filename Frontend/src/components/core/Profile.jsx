import React from 'react'
import { useSelector } from 'react-redux'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { Button } from '../ui/button'
import { MoveRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const Profile = () => {
    const user = useSelector((state) => state.auth.user)
    console.log(user)
    return (
        <div className='p-5 flex flex-col gap-5'>
            <div className="flex gap-5 items-center">
                {/* <Avatar className="w-20 h-20">
                    <AvatarImage src={user?.image}></AvatarImage>
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar> */}
                <div className="">
                    <p className="text-lg">Hello, <span className='font-semibold'>{user.fullName}</span></p>
                    <p className="text-sm font-light">Here is your activities and job profiles.</p>
                </div>
            </div>
            <div className="">
                <div className="w-[96%] bg-red-400 p-4 rounded-md border border-red-700 flex justify-between items-center">
                    <div className="flex gap-5 items-center">
                        <Avatar className="w-12 h-12">
                            <AvatarImage src={user?.image}></AvatarImage>
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className="">
                            <p className="">Your profile editing is not completed.</p>
                            <p className="text-sm font-light">Complete your profile editing & build your custom Resume</p>
                        </div>
                    </div>
                    <Link to='/dashboard/settings'>
                        <Button className='bg-white text-red-400 hover:bg-gray-300 cursor-pointer'>Edit Profile<MoveRight /></Button>
                    </Link>
                </div>
            </div>
            <div className="">
                <div className="w-[96%] ">
                    <div className="flex items-center justify-between">
                        <p className="">{`${user.role === "Recruiter" ? "Recently Published" : "Applied Jobs"}`}</p>
                        <Link to={`${user.role === "Recruiter" ? "/dashboard/jobs/created" : ""}`}>
                            <Button variant='link'>View all <MoveRight /></Button>
                        </Link>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export default Profile