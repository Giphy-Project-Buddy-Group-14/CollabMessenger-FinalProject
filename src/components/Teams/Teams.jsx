import newTeam from "../NewTeam/NewTeam";
import Button from "../Ui/Button";
import { useNavigate } from "react-router-dom";


export default function Teams() {
    const navigate = useNavigate();

    const newTeam = () => {
        navigate('/new-team')
    }

    return (

        <section className="bg-gray-100 py-8">
            <div>
                <Button
                    title="New team"
                    onClick={newTeam}

                />
            </div>

            <div className="container mx-auto text-center px-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Teams</h2>
                <div className="flex flex-wrap -mx-4">
                    <div className="w-full md:w-1/3 px-4 mb-8">
                        <div className="bg-white p-8 shadow-md rounded-md">
                            <i className="fas fa-lock text-4xl text-blue-500 mb-4"></i>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Team 1</h3>
                            <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </div>
                    </div>
                    <div className="w-full md:w-1/3 px-4 mb-8">
                        <div className="bg-white p-8 shadow-md rounded-md">
                            <i className="fas fa-globe-americas text-4xl text-blue-500 mb-4"></i>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Global</h3>
                            <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </div>
                    </div>
                    <div className="w-full md:w-1/3 px-4 mb-8">
                        <div className="bg-white p-8 shadow-md rounded-md">
                            <i className="fas fa-users text-4xl text-blue-500 mb-4"></i>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Collaborative</h3>
                            <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}