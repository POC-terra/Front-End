import { Button, Menu, MenuItem, Typography } from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";
import { useLocale } from "../../hooks/locale-hook";
import { LanguageIsoCode } from "../../utils/enums";

interface LanguageMenuProps {
  textClass: string;
}

export const LanguageMenu = ({ textClass }: LanguageMenuProps) => {
  const { locale, changeLanguage } = useLocale();
  const languages = Object.values(LanguageIsoCode);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const _changeLanguage = (language: LanguageIsoCode) => {
    changeLanguage(language);
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Button id="language-button" aria-controls="language-button" aria-haspopup="true" onClick={handleClick}>
        <Typography variant="caption" className={textClass} noWrap>
          <FormattedMessage id="header.language" />
        </Typography>
      </Button>
      <Menu id="language-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        {languages.map((language, index) => (
          <MenuItem key={index} onClick={() => _changeLanguage(language)} selected={locale.split("-")[0] === language}>
            {language}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
