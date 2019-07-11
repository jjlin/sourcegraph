import { Action } from '@sourcegraph/extension-api-types'
import React from 'react'
import { isCommandOnlyAction } from '../../../../../shared/src/api/types/action'
import { ActionRadioButton } from './ActionRadioButton'
import { CommandActionButton } from './CommandActionButton'

interface Props {
    actions: readonly Action[]
    selectedAction: Action | undefined
    onActionSetSelected: (value: boolean, action: Action) => void

    className?: string
    buttonClassName?: string
}

/**
 * A form control that displays {@link sourcegraph.Action}s.
 *
 * TODO!(sqs): dedupe with ThreadInboxItemActions?
 */
export const ActionsFormControl: React.FunctionComponent<Props> = ({
    actions,
    selectedAction,
    onActionSetSelected,
    className,
    buttonClassName = 'btn btn-link text-decoration-none',
}) => {
    const planActions = actions.filter(action => !isCommandOnlyAction(action))
    const commandActions = actions.filter(isCommandOnlyAction)

    return (
        <div className={`d-flex flex-column align-items-start ${className}`}>
            {planActions.map((action, i) => (
                <ActionRadioButton
                    key={i}
                    action={action}
                    onChange={onActionSetSelected}
                    buttonClassName="btn btn-primary"
                    className="mr-2 mb-2"
                    value={selectedAction === action}
                />
            ))}
            {commandActions.length > 0 && (
                <div className="d-flex flex-wrap">
                    {commandActions.map((action, i) => (
                        <CommandActionButton
                            key={i}
                            action={action}
                            onClick={() => {
                                throw new Error('TODO!')
                            }}
                            className={`${buttonClassName} mr-2 mb-2`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
