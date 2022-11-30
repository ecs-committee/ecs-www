import { Button, Callout, Card, Dialog, Icon, InputGroup, Label } from '@blueprintjs/core'
import { useQueryClient } from '@tanstack/react-query'
import { type NextPage } from 'next'
import { type FormEvent, useState } from 'react'
import DataTable from 'react-data-table-component'
import { LayoutAdmin } from '../../lib/layouts/Admin'
import { type User } from '../../types/user'
import { trpc } from '../../utils/trpc'

const DataTableWrapper = ({ children }: { children: React.ReactNode }) => {
	return <div style={{ marginLeft: -14, marginRight: -14 }}>{children}</div>
}

const STYLE_FORM_INPUT = 'w-full rounded border-gray-300 p-1 pl-2'

const Page: NextPage = () => {
	const queryClient = useQueryClient()
	const users = trpc.user.list.useQuery()
	const data = users.data || []
	const [editUser, setEditUser] = useState<User | null>(null)
	const [createDialogOpen, setCreateDialogOpen] = useState(false)
	const deleteUserMutation = trpc.user.delete.useMutation()

	return (
		<LayoutAdmin title={'User Manager'}>
			{users.isError && <Callout intent="danger">{users.error.message}</Callout>}
			{users.isLoading ? (
				<div>loading</div>
			) : (
				<>
					{editUser !== null && (
						<Dialog isOpen={editUser !== null} onClose={() => setEditUser(null)} title={'Edit User'}>
							<UserEdit user={editUser} onSuccess={() => setEditUser(null)} />
						</Dialog>
					)}
					<DataTableWrapper>
						<DataTable
							columns={[
								{
									name: 'Username',
									selector: (row) => row.username,
								},
								{
									name: 'Role',
									selector: (row) => row.role,
								},
								{
									name: 'Actions',
									selector: (row) => row.id,
									cell: (row) => (
										<>
											<Icon
												icon="edit"
												className="mr-2 cursor-pointer"
												onClick={() => {
													setEditUser(row)
												}}
											/>
											<Icon
												icon="trash"
												className="cursor-pointer"
												onClick={async () => {
													if (confirm('Are you sure you want to delete this user?')) {
														await deleteUserMutation.mutateAsync({ id: row.id })
														queryClient.invalidateQueries([['user', 'list']])
													}
												}}
											/>
										</>
									),
								},
							]}
							data={data}
							pagination
						/>
					</DataTableWrapper>
				</>
			)}
			{createDialogOpen && (
				<Dialog isOpen={true} onClose={() => setCreateDialogOpen(false)} title={'Create User'}>
					<div className="p-4">
						<UserCreate onDone={() => setCreateDialogOpen(false)} />
					</div>
				</Dialog>
			)}
			<Button className="float-right" onClick={() => setCreateDialogOpen(true)} icon="add" intent="primary">
				Create user
			</Button>
		</LayoutAdmin>
	)
}

function UserEdit({ user, onSuccess }: { user: User; onSuccess: () => void }) {
	const queryClient = useQueryClient()
	const [username, setUsername] = useState<string>(user.username)
	const [password, setPassword] = useState<string>('')
	const [role, setRole] = useState<any>(user.role)
	const [changed, setChanged] = useState<boolean>(false)
	const [error, setError] = useState<string | null>(null)
	const userUpdate = trpc.user.update.useMutation()

	const handleSave = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		try {
			await userUpdate.mutateAsync({
				id: user.id,
				username,
				role,
				password,
			})
			queryClient.invalidateQueries([['user', 'list']])
			onSuccess()
		} catch (error: any) {
			setError(error.message)
		}
	}

	return (
		<form className="p-3" onSubmit={(e) => handleSave(e)}>
			<Label>
				Username
				<input
					type="text"
					className={STYLE_FORM_INPUT}
					value={username}
					autoFocus
					onChange={(e) => {
						setUsername(e.target.value)
						setChanged(true)
					}}
				/>
			</Label>
			<Label>
				Password (leave blank to keep current)
				<InputGroup
					placeholder="Password"
					type="password"
					value={password}
					onChange={(e) => {
						setPassword(e.target.value)
						setChanged(true)
					}}
				/>
			</Label>
			<Label>
				Access level
				<select
					className="mt-1 mb-6 w-full rounded-md border-gray-300 p-1 pl-2 pr-9"
					value={role}
					onChange={(e) => {
						setRole(e.target.value as any)
						setChanged(true)
					}}
				>
					<option value="admin">Admin</option>
					<option value="user">User</option>
				</select>
			</Label>
			<Button type="submit" fill intent="primary" disabled={!changed}>
				Save
			</Button>
			{error && <Callout intent="danger">{error}</Callout>}
		</form>
	)
}

function UserCreate({ onDone }: { onDone: () => void }) {
	const createUser = trpc.user.create.useMutation()
	const queryClient = useQueryClient()

	const [username, setUsername] = useState<string>('')
	const [password, setPassword] = useState<string>('')
	const [error, setError] = useState<string | null>(null)

	return (
		<form
			onSubmit={async (e) => {
				setError(null)
				e.preventDefault()
				try {
					await createUser.mutateAsync({ username, password })
					queryClient.invalidateQueries([['user', 'list']])
					onDone()
				} catch (err: any) {
					setError(err.message)
				}
			}}
		>
			<Label>
				Username
				<InputGroup
					placeholder="Username"
					type="text"
					value={username}
					autoFocus
					onChange={(e) => setUsername(e.target.value)}
				/>
			</Label>
			<Label>
				Password
				<InputGroup
					placeholder="Password"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
			</Label>
			<Button type="submit">Create</Button>
			{error && <div className="text-red-500">{error}</div>}
		</form>
	)
}

export default Page
