import { type NextPage } from 'next'
import { type FormEvent, useCallback, useEffect, useState } from 'react'
import { LayoutAdmin } from '../../lib/layouts/Admin'
import { Callout, Button, Label, H3, Card } from '@blueprintjs/core'
import { trpc } from '../../utils/trpc'
import { useQueryClient } from '@tanstack/react-query'
import { cloneDeep } from 'lodash'
import { Popover2 } from '@blueprintjs/popover2'

const Page: NextPage = () => {
	return <LayoutAdmin title="hehe">test</LayoutAdmin>
}

export default Page
