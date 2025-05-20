// "use client"

import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { staffPermission, UsersType } from '@/types'
import { Input } from '@/components/ui/input'
import { UseMutationResult } from '@tanstack/react-query'
// import { useSelector } from 'react-redux'
import { RootState } from '@/Redux/store'

type Props = {
    rowData: UsersType;
    setOpen: (value: boolean) => void;
    staffData: staffPermission;
    open: boolean;
    setStaffData: (value: staffPermission | ((prev: staffPermission) => staffPermission)) => void;
    updateUserMutation: UseMutationResult<any, Error, staffPermission, unknown>;
    subscription: string
};

const PermissionEditor = ({ rowData, setOpen, staffData, open, setStaffData, updateUserMutation, subscription }: Props) => {
    // const {tenant} = useSelector((state:RootState)=>state.app)
    return (
        <Dialog open={open} onOpenChange={() => setOpen(!open)}>
            <DialogContent className="bg-themeBlack max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit {rowData.user.username}</DialogTitle>
                    <DialogDescription>Modify user role and permissions</DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4">
                    {staffData.is_staff && (
                        <div className="flex flex-col">
                            <Label className="text-white">Designation</Label>
                            <Input
                                value={staffData.designation}
                                onChange={(e) => setStaffData({ ...staffData, designation: e.target.value })}
                                placeholder="Enter designation"
                            />
                        </div>
                    )}

                    <div className="flex items-center justify-between">
                        <Label className="text-white">Staff</Label>
                        <Switch
                            checked={staffData.is_staff}
                            onCheckedChange={(checked) => {
                                setStaffData((prev) => ({
                                    ...prev,
                                    is_staff: checked,
                                    ...(checked ? {} : {
                                        hasStaffPermission: false,
                                        hasBlogPermission: false,
                                        hasCommunityPermission: false,
                                        hasNewsletterPermission: false,
                                        hasCoursesPermission: false,
                                        hasBuilderPermission: false,
                                        designation: ''
                                    })
                                }));
                            }}
                        />

                    </div>

                    {staffData.is_staff && (
                        <div className="grid grid-cols-2 gap-4">
                            {(
                                [
                                    ["hasStaffPermission", "Staff Controller"],
                                    ["hasBlogPermission", "Blog Controller"],
                                    ["hasCommunityPermission", "Community Controller"],
                                    ["hasNewsletterPermission", "Newsletter Controller"],
                                    ["hasCoursesPermission", "Courses Controller"],
                                    ["hasBuilderPermission", "Builder Controller"],
                                ] as const
                            )
                                .filter(([key]) =>
                                    subscription === '1'
                                        ? key === 'hasStaffPermission' || key === 'hasBlogPermission'
                                        : true
                                )
                                .map(([key, label]) => (
                                    <div key={key} className="flex items-center justify-between">
                                        <Label className="text-white">{label}</Label>
                                        <Switch
                                            checked={Boolean(staffData[key as keyof staffPermission])}
                                            onCheckedChange={(checked) =>
                                                setStaffData((prev) => ({
                                                    ...prev,
                                                    [key as keyof staffPermission]: checked,
                                                }))
                                            }
                                        />

                                    </div>
                                ))}
                        </div>
                    )}

                    <Button
                        className="w-full mt-4"
                        onClick={() => {
                            setStaffData((prev) => {
                                updateUserMutation.mutate(prev);
                                return prev;
                            });
                            setOpen(!open);
                        }}
                    >
                        Save
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PermissionEditor;
