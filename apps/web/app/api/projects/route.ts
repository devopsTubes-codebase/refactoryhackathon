import { createProjectForUser, listProjectsForUser, type CreateProjectInput } from '@codebase-wiki/api';
import { NextResponse } from 'next/server';
import { getRequiredSessionIdentity, UnauthorizedError } from '@/lib/auth/session';

function toUnauthorizedResponse() {
  return NextResponse.json(
    {
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication is required for this endpoint',
      },
    },
    { status: 401 }
  );
}

function toBadRequestResponse(message: string) {
  return NextResponse.json(
    {
      error: {
        code: 'BAD_REQUEST',
        message,
      },
    },
    { status: 400 }
  );
}

export async function GET() {
  try {
    const identity = await getRequiredSessionIdentity();
    const projects = listProjectsForUser(identity);
    return NextResponse.json({ data: projects }, { status: 200 });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return toUnauthorizedResponse();
    }

    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch projects',
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const identity = await getRequiredSessionIdentity();
    const body = (await request.json()) as Partial<CreateProjectInput>;

    if (!body.name || !body.sourceType || !body.sourceInput) {
      return toBadRequestResponse('name, sourceType, and sourceInput are required');
    }

    const project = createProjectForUser(identity, {
      name: body.name,
      sourceType: body.sourceType,
      sourceInput: body.sourceInput,
    });

    return NextResponse.json({ data: project }, { status: 201 });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return toUnauthorizedResponse();
    }

    if (error instanceof Error) {
      return toBadRequestResponse(error.message);
    }

    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to create project',
        },
      },
      { status: 500 }
    );
  }
}
