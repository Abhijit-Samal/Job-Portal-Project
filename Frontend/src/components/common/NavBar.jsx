import React from 'react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { LogOut, Menu, User } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { LOGOUT_END_POINT, VERIFY_END_POINT } from '@/Constants'
import { setUser } from '@/app/features/authSlice'
import { Separator } from '../ui/separator'

const NavBar = () => {

    const user = useSelector((state) => state.auth.user)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const HandleLogout = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/${LOGOUT_END_POINT}`, {}, {
                withCredentials: true,
            })
            if (response.data.success) {
                dispatch(setUser(null));
                navigate("/")
                console.log("logout successfully")
            }


        }
        catch (err) {
            console.log(err)
        }
    }

    // const HandleLogin = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/${VERIFY_END_POINT}`, {}, {
    //             withCredentials: true,
    //         })
    //         if (response.data.success) {
    //             dispatch(setUser(response.data.user));
    //             navigate("/")
    //             console.log("login successfull")
    //         }

    //     }
    //     catch (err) {
    //         navigate("/login")
    //         console.log(err)
    //     }
    // }
    return (
        <>
            <div className="w-full h-16 flex">
                <div className="w-8/11 m-auto flex justify-between">
                    <div className="text-2xl font-semibold">Job <span className='text-red-500 text-2xl font-semibold'>Portal</span></div>
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger>
                                <Menu />
                            </SheetTrigger>
                            <SheetContent className="w-2xs">
                                <SheetContent className="w-[260px] sm:w-[300px] px-5 pt-5">
                                    {user ? (
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="w-16 h-16">
                                                    <AvatarImage src={user.image} />
                                                    <AvatarFallback className="text-md">CN</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-lg font-semibold">{user.fullName}</p>
                                                    <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                                                </div>
                                            </div>

                                            <Separator className='my-2' />

                                            <Link to="/dashboard/profile">
                                                <Button variant="ghost" className="w-full justify-start text-sm">
                                                    <User className="mr-2 h-4 w-4" /> View Profile
                                                </Button>
                                            </Link>

                                            <Button
                                                variant="ghost"
                                                onClick={HandleLogout}
                                                className="w-full justify-start text-sm text-red-600"
                                            >
                                                <LogOut className="mr-2 h-4 w-4" /> Logout
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <Link to="/login" className="flex-1">
                                                <Button variant="outline" className="w-full">Login</Button>
                                            </Link>
                                            <Link to="/signup" className="flex-1">
                                                <Button className="w-full">Sign Up</Button>
                                            </Link>
                                        </div>
                                    )}
                                </SheetContent>

                            </SheetContent>
                        </Sheet>
                    </div>
                    <div className="max-md:hidden">
                        <ul className="h-full flex items-center gap-5 cursor-pointer">
                            <Link to='/'>
                                <li className="">Home</li>
                            </Link>
                            <Link to='/jobs'>
                                <li className="">jobs</li>
                            </Link>
                        </ul>
                    </div>
                    <div className="max-md:hidden">
                        {
                            (user !== null) ? (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Avatar className="cursor-pointer">
                                            <AvatarImage src={user.image}></AvatarImage>
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                    </PopoverTrigger>
                                    <PopoverContent className="min-w-fit flex flex-col gap-2">
                                        <div className="flex items-center gap-4 mb-3">
                                            <Avatar className="cursor-pointer w-20 h-20">
                                                <AvatarImage src={user.image}></AvatarImage>
                                                <AvatarFallback className="text-4xl">CN</AvatarFallback>
                                            </Avatar>
                                            <div className="">
                                                <p className="text-xl font-semibold">{user.fullName}</p>
                                                <p className="text-xs">{user?.role}</p>
                                            </div>
                                        </div>
                                        <Separator className='mb-2' />
                                        <div className="flex items-center">
                                            <User className='w-4' />
                                            <Link to='/dashboard/profile'>
                                                <Button variant="link" className="text-sm">View Profile</Button>
                                            </Link>
                                        </div>
                                        <div className="flex items-center">
                                            <LogOut className='w-4' />
                                            <Button variant="link" onClick={HandleLogout} className="text-sm">Log Out</Button>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            ) : (
                                <div className="flex gap-2">
                                    <Link to='/login'>
                                        <Button variant="outline">Login</Button>
                                    </Link>
                                    <Link to="/signup">
                                        <Button>Sign up</Button>
                                    </Link>
                                </div>
                            )
                        }

                    </div>
                </div>
            </div>
        </>
    )
}

export default NavBar