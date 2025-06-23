import { NextRequest, NextResponse } from "next/server";


// In-memory notes store
let notes: {
    id: number;
    title: string;
    description: string
}[] = [];
let nextId = 1;

export async function GET() {
    return NextResponse.json(notes);
}

export async function POST(request: NextRequest) {
    const { title, description } = await request.json();

    if (!title || !description) {
        return NextResponse.json({
            error: "Title and Description are required."
        }, { status: 400 });
    }

    const note = {
        id: nextId++,
        title,
        description
    }
    notes.push(note);
    return NextResponse.json(note, { status: 201 });
}

export async function PUT(request: NextRequest) {
    const { id, title, description } = await request.json();
    const note = notes.find((n) => n.id === id);
    if (!note) {
        return NextResponse.json({
            error: "Note not found."
        }, { status: 404 });
    }

    if (title !== undefined) {
        note.title = title;
    }
    if (description !== undefined) {
        note.description = description;
    }
    return NextResponse.json(note);
}

export async function DELETE(request: NextRequest) {
    const { id } = await request.json();
    const index = notes.findIndex((n) => n.id === id);
    if (index === -1) {
        return NextResponse.json({
            error: "Note not found."
        }, { status: 404 });
    }
    const deleted = notes.splice(index, 1)[0];
    return NextResponse.json(deleted);
}