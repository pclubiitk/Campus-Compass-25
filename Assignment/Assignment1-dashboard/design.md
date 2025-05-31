## Tables
1. Logs - (changes - places added, modified, review added, photo added)
2. Reviews - (id, user_id, Place, Review(text), Rating, status, time)
3. Place requests(globally) - (id, user_id, Coordinates, Name, type(new/edit), status)
4. Users(user_id, name, email, pwd, role, joined_Date/time, last_login??)
5. Places(place (as an id), name, description, category, coordinates,  
6. Notices (issued_to, time, reason)

## UI
### User side
- Search bar at top
- Pop-up/collapsible side column, similar to GMaps layout, would contain panels for info, reviews, photo etc.
- Simple search and zoom fxnality, markers for places, category tags
- Saved places (Locally saved), contribution history on users' side too
- Dynamic shortest route visualisation
- Hover to preview feature
- (Suggestion) Should be also available to vendors/shop owners, to add their place, description etc.

### Admin side
- Stats dashboard cards (No. of users (active and registered), No. of searches (ig?), places added etc.)
- (Suggestion) Notices should be issued by admin to users for flagged content etc. (in which case Notice table to be added)
- UI for all the above tables, in form of a side panel/drop down... something

## Backend
### Routes we would need...
User only: 
- POST /login
- POST /register
- POST /logout
Admin side:
- 
