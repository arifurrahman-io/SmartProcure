const firestoreRulesNotes = `
Firestore Rules Planning Notes

1. Users Collection
- Authenticated users can read limited profile data
- Only admin can create/update role fields
- A user can update only their own non-sensitive profile fields

2. Requests Collection
- Authenticated committee members can create requests
- All authenticated users can read requests
- Only creator can edit request before approval
- Admin can update request status

3. Quotations Collection
- All authenticated users can create quotations
- All authenticated users can read quotations
- Only admin can approve quotation
- Approved quotation should not be editable by normal users

4. Instructions Collection
- Only admin can create purchase instructions
- All authenticated users can read instructions
- Only admin or assigned authority can mark completion

5. Notifications Collection
- Users can only read their own notifications
- System/admin can create notifications

6. History / Activity Logs
- Users can read logs if authenticated
- Writes should be controlled by system logic / admin actions

Suggested production rule idea:
- request.auth != null
- role-based checks from /users/{uid}
- protect immutable approved/completed records
`;

export default firestoreRulesNotes;
