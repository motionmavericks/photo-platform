import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Profile() {
  // This would typically fetch user data from the API
  const user = {
    username: "john_doe",
    email: "john@example.com",
    albumCount: 5,
    photoCount: 120,
  }

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <div className="space-y-8 p-8">
        <h1 className="text-3xl font-bold">User Profile</h1>
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src="/placeholder.svg" alt={user.username} />
                <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{user.username}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Albums</h3>
                <p>{user.albumCount}</p>
              </div>
              <div>
                <h3 className="font-semibold">Photos</h3>
                <p>{user.photoCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          <Button>Edit Profile</Button>
          <Button variant="outline">Change Password</Button>
        </div>
      </div>
    </div>
  )
}

