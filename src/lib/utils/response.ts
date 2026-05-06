import { NextResponse } from 'next/server';

export function ok(data: unknown, message: string, statusCode = 200): NextResponse {
  return NextResponse.json({ data, statusCode, message, success: true }, { status: statusCode });
}

export function errorResponse(
  errors: { message: string; field?: string }[],
  statusCode: number,
  errorMsg: string,
): NextResponse {
  return NextResponse.json(
    {
      errors,
      statusCode,
      message: errors[0]?.message ?? errorMsg,
      success: false,
      error: errorMsg,
    },
    { status: statusCode },
  );
}
