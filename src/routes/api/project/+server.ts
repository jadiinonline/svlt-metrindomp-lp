import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/project - List all projects with pagination.
export const GET: RequestHandler = async ({ url }) => {
	const page = parseInt(url.searchParams.get('page') || '1');
	const limit = parseInt(url.searchParams.get('limit') || '10');
	const offset = (page - 1) * limit;

	try {
		const projects = await prisma.project.findMany({
			skip: offset, // Use offset instead of skip
			take: limit, // Use limit instead of take
			orderBy: {
				createdAt: 'desc',
			},
		});
		const totalProjects = await prisma.project.count();

		return json({
			projects,
			currentPage: page,
			totalPages: Math.ceil(totalProjects / limit),
			totalProjects,
		});
	} catch (error) {
		console.error('Error fetching projects:', error);
		return json({ error: 'Failed to fetch projects' }, { status: 500 });
	}
};

// POST /api/project - Create a new project
export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();
		const newProject = await prisma.project.create({
			data: {
				name: data.name,
				description: data.description,
				// Add other fields as necessary
			},
		});
		return json(newProject, { status: 201 });
	} catch (error) {
		console.error('Error creating project:', error);
		return json({ error: 'Failed to create project' }, { status: 500 });
	}
};

// PUT /api/project/[id] - Update an existing project (This would typically be in a dynamic route [id])
// For simplicity, we'll include a basic update example here, but a dedicated [id] route is better.
export const PUT: RequestHandler = async ({ request, url }) => {
	const id = url.searchParams.get('id');
	if (!id) {
		return json({ error: 'Project ID is required' }, { status: 400 });
	}

	try {
		const data = await request.json();
		const updatedProject = await prisma.project.update({
			where: {
				id: parseInt(id),
			},
			data: {
				name: data.name,
				description: data.description,
				// Add other fields as necessary
			},
		});
		return json(updatedProject, { status: 200 });
	} catch (error) {
		console.error(`Error updating project with ID ${id}:`, error);
		return json({ error: `Failed to update project with ID ${id}` }, { status: 500 });
	}
};