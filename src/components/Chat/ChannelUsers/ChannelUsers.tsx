import { useEffect, useState } from "react";
import React from "react";
import { searchUsers } from "../../../services/user.service";
import { addChannelMember, removeChannelMember } from "../../../services/channel.service";


export const ChannelUsers = ({teamId, channel}) => {
    const [search, setSearch] = useState<string>('');
    const [filteredUsers, setFilteredUsers] = useState<any[]>([]);

    const onSelectUserToAdd = (user) => {
        void addChannelMember(teamId, channel.id, user);
    };


    const onRemoveUserFromChannel = (user) => {
        void removeChannelMember(teamId, channel.id, user);
    }

    useEffect(() => {
        // fetch users by search
        const getUsers = async () => {
            const foundUsers = await searchUsers(search);
            setFilteredUsers(foundUsers);
        }

        if (search.length > 0 && channel) {
            void getUsers();
        } else {
            setFilteredUsers([]);
        }
    }, [search]);

    if (!channel) {
        return null;
    }

    return (
        <div className="users">
            <div className="users__search">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search for a user"
                />
            </div>

            { filteredUsers.length !== 0 && (
                <ul>
                {filteredUsers.map((user, index) => (
                    <li
                        key={index}
                        className="py-2 flex"
                    >
                        <div onClick={() => onSelectUserToAdd(user)} className="hover:text-teal-500 cursor-pointer">
                            <b>{user.username}</b> ({user.email})
                        </div>
                    </li>
                ))}
                </ul>
            )}

            <div className="mt-8">
                <strong>Channel users:</strong>

                {Object.keys(channel?.members || {}).map((memberKey, index) => {
                    const user = channel.members[memberKey];

                    return (
                        <div key={index} className="flex gap-2 items-center mt-4 justify-between">
                            <div className="flex gap-2">
                                <img src={user.profilePictureURL} className="rounded-full w-6 h-6 border-1 border-gray-600 inline-block"/>
                                <div>{ user.username }</div>
                            </div>   

                            <div
                                onClick={() => onRemoveUserFromChannel(user)}
                                className="px-2 flex justify-center items-center cursor-pointer bg-slate-200 rounded-full"
                            >
                                x
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}