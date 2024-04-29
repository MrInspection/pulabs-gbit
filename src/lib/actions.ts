"use server"

import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import {redirect} from "next/navigation";
import prisma from "@/lib/db";
import {Prisma, TypeOfVote} from "@prisma/client";
import {JSONContent} from "@tiptap/react";
import {revalidatePath} from "next/cache";

export async function UpdateUsername(prevState: any, formData: FormData) {

    const {getUser} = getKindeServerSession()
    const user = await getUser()

    if(!user) { return redirect("/api/auth/login") }
    const username = formData.get('username') as string

    try {
        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                userName: username,
            },
        })

        return {
            message: "Username successfully updated",
            status: "green"
        }

    } catch (e) {
        if(e instanceof Prisma.PrismaClientKnownRequestError) {
            if(e.code === 'P2002') {
                return {
                    message: "This username is already been used",
                    status: "error"
                }
            }
        }
        throw e;
    }
}

export async function CreateCommunity(prevState : any ,formData : FormData) {
    const {getUser} = getKindeServerSession()
    const user = await getUser()

    const name = formData.get('name') as string
    if (!user) { return redirect("/api/auth/login") }

    try {
        const data = await prisma.subreddit.create({
            data: {
                name: name,
                userId: user.id,
            }
        })
        return redirect(`/r/${data.name}`)
    } catch (e) {
        if(e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === 'P2002') {
                return {
                    message: "This name is already being used.",
                    status : "error"
                }
            }
        }
        throw e;
    }
}

export async function UpdateSubDescription(prevState: any, formData: FormData) {
    const {getUser} = getKindeServerSession()
    const user = await getUser()

    if (!user) { return redirect("/api/auth/login") }

    try {
        const subName = formData.get('subName') as string
        const description = formData.get('description') as string

        await prisma.subreddit.update({
            where: {
                name: subName,
            },
            data: {
                description: description,
            }
        })
        return {
            message: "Your community description has been updated",
            status: "green",
        }
    } catch (e) {
        return {
            status: "error",
            message: "Unable to update the description of your community"
        }
    }
}

export async function CreatePost({jsonContent} : {jsonContent : JSONContent | null},formData: FormData) {
    const {getUser} = getKindeServerSession()
    const user = await getUser()

    if (!user) { return redirect("/api/auth/login") }
    const title = formData.get('title') as string
    const subName = formData.get('subName') as string

    await prisma.post.create({
        data: {
            title: title,
            subName: subName,
            userId: user.id,
            textContent: jsonContent ?? undefined,
        }
    })
    return redirect("/community")
}

export async function HandleVote(formData : FormData) {
    const {getUser} = getKindeServerSession()
    const user = await getUser()

    if (!user) { return redirect("/api/auth/login") }
    const postID = formData.get('postID') as string
    const voteDirection = formData.get('voteDirection') as TypeOfVote

    const vote = await prisma.vote.findFirst({
        where: {
            postId: postID,
            userId: user.id,
        }
    })

    if(vote) {
        if(vote.voteType === voteDirection) {
            await prisma.vote.delete({
                where: {
                    id: vote.id,
                }
            })
            return revalidatePath("/community")
        } else {
            await prisma.vote.update({
                where: {
                    id: vote.id,
                }, data: {
                    voteType: voteDirection,
                }
            })
            return revalidatePath("/community")
        }
    }

    await prisma.vote.create({
        data: {
            voteType: voteDirection,
            userId: user.id,
            postId: postID,
        }
    })
    return revalidatePath("/community")
}

export async function CreateComment(formData : FormData) {
    const {getUser} = getKindeServerSession()
    const user = await getUser()

    if (!user) { return redirect("/api/auth/login") }

    const comment = formData.get('comment') as string
    const postId = formData.get('postId') as string

    const data = await prisma.comment.create({
        data: {
            text: comment,
            userId: user.id,
            postId: postId,
        }
    })

    revalidatePath(`/post/${postId}`)


}