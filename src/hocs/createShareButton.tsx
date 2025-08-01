import React, { forwardRef } from 'react'

import SocialShareButton, {
  Props as ShareButtonProps,
} from '../components/SocialShareButton'

function createShareButton<
  OptionProps extends Record<string, any>,
  LinkOptions extends Record<string, any> = OptionProps,
>(
  networkName: string,
  link: (url: string, options: LinkOptions) => string,
  optsMap: (props: OptionProps) => LinkOptions,
  defaultProps: Partial<ShareButtonProps<LinkOptions> & OptionProps> = {},
) {
  type Props = Omit<
    ShareButtonProps<LinkOptions>,
    'forwardedRef' | 'networkName' | 'networkLink' | 'opts'
  > &
    OptionProps

  const CreatedButton = forwardRef<HTMLButtonElement, Props>((props, ref) => {
    const opts = optsMap(props as OptionProps)
    const passedProps = { ...props }

    const optsKeys = Object.keys(opts as Record<string, any>)
    optsKeys.forEach((key) => {
      delete (passedProps as any)[key]
    })

    return (
      <SocialShareButton<LinkOptions>
        {...(defaultProps as any)}
        {...(passedProps as any)}
        forwardedRef={ref}
        networkName={networkName}
        networkLink={link}
        opts={opts}
      />
    )
  })

  CreatedButton.displayName = `ShareButton-${networkName}`

  return CreatedButton
}

export default createShareButton
