# Upload Documents

This folder contains files uploaded through the project management application.

## Purpose

This directory serves as the file storage location for:
- Project documentation and attachments
- Task deliverables and supporting files
- Employee-submitted documents
- Any other files uploaded via the application's file upload feature

## File Storage

- Files are uploaded via the backend API endpoint `POST /api/upload`
- Files are served statically through `GET /api/upload/:filename`
- File names may include timestamps and project/task identifiers for organization
- The backend automatically creates this directory if it doesn't exist

## File Organization

Uploaded files may follow naming patterns like:
- `{description}_{project_name}_project_{timestamp}`
- `{task_name}_{project_name}_project_{timestamp}`
- Original filenames are preserved when possible

## Backend Integration

- **Upload Route**: `POST /api/upload` with multipart/form-data
- **Static Serving**: Files accessible at `/api/upload/<filename>`
- **Security**: File paths use `path.basename()` to prevent directory traversal
- **Auto-Creation**: Directory is created automatically if missing

## Notes

- This folder is created and managed by the backend server
- Files are stored with safe filenames to prevent security issues
- Large files should be handled with appropriate size limits in the backend
- Consider implementing file cleanup for old/unused uploads in production

## Development

During development, you may see test files and sample uploads here. In production, implement proper file management policies including:
- File size limits
- File type restrictions
- Regular cleanup of old files
- Backup strategies for important documents