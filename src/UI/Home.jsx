import { FaGithub, FaLinkedin, FaTwitter, FaInstagram , FaSpinner} from "react-icons/fa";
import { SiMinutemailer } from "react-icons/si";
import Timeline from "../COMPONANTS/Timeline/TimeLine";
import Footer from "../COMPONANTS/Footer/Footer";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../Context/context-provider";
import { Link } from "react-router-dom";

export default function LandingPage() {
    const { user, setUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(true); // To handle loading state

    useEffect(() => {
        let isMounted = true; // Track if the component is mounted

        const fetchData = async () => {
            try {
                const response = await axios.get('https://portfolio-node-express-b7vo.onrender.com/api/v1/users/get-admin-data',{
                    withCredentials: true
                });
                if (isMounted && response.data.success === true) {
                    setUser(response.data.adminData);
                }
            } catch (error) {
                console.error("Error fetching data: ", error);
            } finally {
                if (isMounted) {
                    setLoading(false); // Set loading to false once the data is fetched
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false; // Cleanup function to set isMounted to false
        };
    }, [setUser]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                    <FaSpinner className="text-6xl text-blue-400 animate-spin" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Internal server error...</p>
            </div>
        );
    }
    return (
        <div className="min-h-screen flex flex-col items-center to-blue-200 py-10 pt-30">
            {/* Hero Section */}
            <div className="max-w-5xl w-full rounded-2xl p-10 flex flex-col md:flex-row items-center mb-12">
                {/* Left Side - Text */}
                <div className="md:w-1/2 text-center md:text-left">
                    <h1 className="text-5xl font-bold text-gray-900">{user.name}</h1>
                    <p className="text-xl text-gray-600 mt-2">{user.bio}</p>
                    <p className="text-gray-500 mt-4 leading-relaxed">
                        Passionate about building scalable web applications with React.js, Node.js, and MongoDB. 
                        Always eager to learn and explore new technologies.
                    </p> 

                    {/* Social Links */}
                    <div className="flex justify-center md:justify-start space-x-5 mt-6">
                        {[
                            { href: user.github, icon: <FaGithub /> },
                            { href: user.linkedin, icon: <FaLinkedin /> },
                            { href: user.twitter, icon: <FaTwitter /> },
                            { href: user.email, icon: <SiMinutemailer /> },
                        ].map(({ href, icon }, index) => (
                            <Link
                                key={index} 
                                to={href} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                onClick={(e) => {
                                    if (href === user.email) {
                                        e.preventDefault();
                                        window.location.href = `mailto:${user.email}`;
                                    }
                                }}
                                className="text-gray-600 hover:text-blue-500 text-3xl transition-transform transform hover:scale-110"
                            >
                                {icon}
                            </Link>
                        ))}
                    </div>

                    {/* Download Resume Button */}
                    <div className="mt-6">
                        <Link
                            to={user.resume.url} 
                            download 
                            target="_blank"
                            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition-colors"
                        >
                            Download Resume
                        </Link>
                    </div>
                </div>

                {/* Right Side - Image */}
                <div className="md:w-1/2 flex justify-center mt-8 md:mt-0">
                    <img 
                        src={user.avatar.url} 
                        alt="Web Developer Illustration" 
                        className="w-72 rounded-xl shadow-lg"
                    />
                </div>
            </div>
            {/* TimeLine Section */}
            <div className="max-w-5xl w-full mt-12">
                <Timeline />
            </div>
            {/* Skills Section */}
            <div className="flex flex-col items-center">
                <Footer/>
            </div>
        </div>
    );
}
