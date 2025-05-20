import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getLetters, getSubdomain, getTwoLetters } from "@/constants";
import { Role, staffPermission, UsersType } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Ban, Key, MoreVertical, StopCircle } from "lucide-react";
import { useEffect, useState } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import TextCopyButton from "./text-copy";
import Assure from "@/components/global/Assure";
import axiosInstance from "@/axios/public-instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

import PermissionEditor from "./permission-editor";
import { useAzure } from "@/providers/assure-provider";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/store";



export const columns: ColumnDef<UsersType>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => {
            const avatarUrl = row.original.user.profile_pic
            return (
                <div className="flex items-center gap-4">
                    <div className="h-11 w-11 relative flex-none">
                        <Avatar>
                            <AvatarImage src={avatarUrl} />
                            <AvatarFallback>{getTwoLetters(row.original.user.full_name)}</AvatarFallback>
                        </Avatar>
                    </div>
                    <span>{row.original.user.full_name}</span>
                </div>
            )
        },
    },

    {
        header: "Email",
        cell: ({ row }) => <div className='font-bold flex items-center gap-3 '>
            {row.original.user.email}
            <TextCopyButton text={row.original.user.email} />
        </div>,
    },
    {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }) => {
            const role: Role = row.getValue('role')
            const designation = row.original.designation
            return (
                <TooltipProvider>
                    {designation.length > 0 && designation.split(' ').length > 1 ? (
                        <Tooltip>
                            <TooltipTrigger>
                                <Badge
                                    className={clsx({
                                        'bg-green-300 ': role === 'admin',
                                        'bg-orange-300': role === 'staff',
                                        'bg-white': role === 'user',
                                        'cursor-pointer': true
                                    })}
                                >
                                    {role === 'staff' && designation.length > 0
                                        ? getLetters(designation)
                                        : role.charAt(0).toUpperCase() + role.slice(1)}
                                </Badge>
                            </TooltipTrigger>
                            <TooltipContent className="bg-themeDarkGray text-themeTextWhite">{designation}</TooltipContent>
                        </Tooltip>
                    ) : (
                        <Badge
                            className={clsx({
                                'bg-green-300 ': role === 'admin',
                                'bg-orange-300': role === 'staff',
                                'bg-white': role === 'user',
                                'cursor-pointer': true
                            })}
                        >
                            {(designation.length > 0 && designation.split(' ').length === 1) ? designation : (role.charAt(0).toUpperCase() + role.slice(1))}
                        </Badge>
                    )}
                </TooltipProvider>


            )
        },
    },
    {
        id: 'action',
        cell: ({ row }) => {
            return (
                <CallToAction rowData={row.original} />
            )
        }
    }
]


interface Props {
    rowData: UsersType
}
const CallToAction: React.FC<Props> = ({ rowData }) => {
    const [open, setOpen] = useState<boolean>(false);
    const [banBlock, setBanBlock] = useState("");
    const {
        setDescription,
        setTitle,
        handleOpen,
        setOnConfirm,
    } = useAzure();
    const {schemaName,tenant} = useSelector((state:RootState)=>state.app)


    const queryClient = useQueryClient();
    const [staffData, setStaffData] = useState<staffPermission>({
        is_staff: rowData.is_staff,
        hasBlogPermission: rowData.hasBlogPermission,
        hasCommunityPermission: rowData.hasCommunityPermission,
        hasNewsletterPermission: rowData.hasNewsletterPermission,
        hasCoursesPermission: rowData.hasCoursesPermission,
        designation: rowData.designation,
        hasStaffPermission: rowData.hasStaffPermission,
        hasBuilderPermission : rowData.hasBuilderPermission

    })
    const [actionType, setActionType] = useState<"ban" | "block" | null>(null);

    useEffect(() => {
        if (!actionType) return;

        const isBan = actionType === "ban";
        const isBlocked = rowData.blocked;
        const isBanned = rowData.banned;

        setTitle(isBan ? (isBanned ? "Unban this user?" : "Ban this user?") : (isBlocked ? "Unblock this user?" : "Block this user?"));

        setDescription(
            isBan
                ? isBanned
                    ? "This action will unban the user. They will regain limited access."
                    : "This action will ban the user. They will only access paid content."
                : isBlocked
                    ? "This will unblock the user and allow full access."
                    : "This will block the user entirely from the platform."
        );

        setOnConfirm(() => {
            if (isBan) {
                banMutation.mutate();
            } else {
                blockMutation.mutate();
            }
            setActionType(null);
        });

        handleOpen();
    }, [actionType]);



    const banUser = async () => {
        const { data } = await axiosInstance.post(`user/${schemaName}/ban/${rowData.user.username}`);
        return data;
    };

    const blockUser = async () => {
        const { data } = await axiosInstance.post(`user/${schemaName}/block/${rowData.user.username}`);
        return data;
    };

    const banMutation = useMutation({
        mutationKey: ['banning'],
        mutationFn: banUser,
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["users"] });
            toast.success( `User ${rowData.user.username} ${rowData.banned ? "Unbanned" : "Banned"}` ,{
                
                description: !rowData.banned ? "User banned successfully" : "User unbanned successfully",
            });
            const previousUsers = queryClient.getQueryData(["users"]);
            queryClient.setQueryData(["users"], (oldData: any) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    pages: oldData.pages.map((page: any) => ({
                        ...page,
                        users: page.users.map((user: any) =>
                            user.username === rowData.user.username ? { ...user, banned: !user.banned } : user
                        ),
                    })),
                };
            });
            return { previousUsers };
        },
        onError: (err, newData, context) => {
            if (context?.previousUsers) {
                queryClient.setQueryData(["users"], context.previousUsers);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });

    const blockMutation = useMutation({
        mutationKey: ['blocking'],
        mutationFn: blockUser,
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["users"] });
        
            toast.success( `User ${rowData.user.username} ${rowData.blocked ? "Unblocked" : "Blocked"}` ,{
                
                description: !rowData.blocked ? "User blocked successfully" : "User unblocked successfully",
            });
            const previousUsers = queryClient.getQueryData(["users"]);
            queryClient.setQueryData(["users"], (oldData: any) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    pages: oldData.pages.map((page: any) => ({
                        ...page,
                        users: page.users.map((user: any) =>
                            user.username === rowData.user.username ? { ...user, blocked: !user.blocked } : user
                        ),
                    })),
                };
            });
            return { previousUsers };
        },
        onError: (err, newData, context) => {
            if (context?.previousUsers) {
                queryClient.setQueryData(["users"], context.previousUsers);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });

    const makeStaff = async (newStatus: staffPermission) => {
        return axiosInstance.patch(`user/${schemaName}/tenantuser/${rowData.user.username}`, newStatus);
    };

    const updateUserMutation = useMutation({
        mutationFn: makeStaff,
        onMutate: async (newStatus) => {
            await queryClient.cancelQueries({ queryKey: ["users"] });

            toast.success(`User ${rowData.user.username} Updated`, {
                description: "User Data updated successfully",
            });

            const previousUsers = queryClient.getQueryData(["users"]);

            queryClient.setQueryData(["users"], (oldData: any) => {
                if (!oldData) return oldData;

                return {
                    ...oldData,
                    pages: oldData.pages.map((page: any) => ({
                        ...page,
                        users: page.users.map((user: any) =>
                            user.username === rowData.user.username
                                ? {
                                    ...user,
                                    is_staff: newStatus,
                                    role: newStatus ? "staff" : "user"
                                }
                                : { ...user }
                        ),
                    })),
                };
            });

            return { previousUsers };
        },
        onError: (err, newData, context) => {
            console.error(err);
            if (context?.previousUsers) {
                queryClient.setQueryData(["users"], context.previousUsers);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        }
    });


    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger disabled={rowData.role === "admin"} className="focus:outline-none">
                    <MoreVertical className={clsx({ "text-gray-600": rowData.role === "admin", "cursor-not-allowed": rowData.role === "admin" })} />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-themeBlack">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setOpen(true)}>
                        <Key color="#2563EB" /> Permissions
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActionType("ban")}>
                        <Ban color="orange" /> {rowData.banned ? "Unban" : "Ban"}
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => setActionType("block")}>
                        <StopCircle color="red" /> {rowData.blocked ? "Unblock" : "Block"}
                    </DropdownMenuItem>


                </DropdownMenuContent>
            </DropdownMenu>

            <PermissionEditor rowData={rowData} setOpen={setOpen} open={open} setStaffData={setStaffData} staffData={staffData} updateUserMutation={updateUserMutation} subscription={tenant.subscription_plan  || '1'}/>
            {/* <Assure open={!!banBlock} handleOpen={() => setBanBlock("")} description={banBlock === "block" ? "This action will block the user. User will be completely prohibited from the page." : "This action will ban the user, they will only be able to access things for which they have paid."} onConfirm={() => { banBlock === "block" ? blockMutation.mutate() : banMutation.mutate(); }} /> */}
        </>
    );
};
