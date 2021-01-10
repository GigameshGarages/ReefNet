contract BVault {
    
    BToken bt;
    address public owner;
    uint public creationTime;
    
    struct _userVault {
        uint lastMilestone;
        uint allowedAmount;
        uint redeemedMilestones;
    }
    
    mapping(address => _userVault) userVault; 
    
    modifier ownerOnly {
        require(msg.sender == owner);
        _;
    }
    
    function Vault() public {
        owner = msg.sender;
        creationTime = now;
        gt = new GamblingToken();
    }
    
    // only admin can transfer the tokens
    function transferTokens(address user,uint amount) public ownerOnly returns(bool) {
        return gt.transfer(user,amount);
    }
    
    function withdraw() public returns(bool) {
        // admin can't withdraw tokens as he can tranfer tokens to any address and even to himself
        require( msg.sender != owner );
        uint amount = calculateAmount();
        require(amount > 0);
        userVault[msg.sender].redeemedMilestones += 1;
        userVault[msg.sender].lastMilestone = now;
        return gt.transfer(msg.sender,amount);
    }
    
    function getBalance(address a) public view returns(uint) {
        return gt.balanceOf(a);
    }
    
    // calculate amount based on intervals and milestones (here: 10% amount in an interval upto 10 milestones)
    function calculateAmount() public returns(uint) {
        // interval in months
        uint interval = (now - userVault[msg.sender].lastMilestone) / 30 days;
        if (interval > 0 && interval > userVault[msg.sender].redeemedMilestones && userVault[msg.sender].redeemedMilestones <= 10) {
            uint availableMilestones = interval - userVault[msg.sender].redeemedMilestones;
            // returns 10% of availableMilestones of allowedAmount
            return (availableMilestones * userVault[msg.sender].allowedAmount) * 10 / 100;
        } else { return 0; }
    }
    
    // Only admin can lock user account for certain period and amount.
    function lockAccount(address user,uint amount) public ownerOnly {
        _userVault memory uv;
        uv.lastMilestone = now;
        //uv.lastMilestone = now - 60 days; // FOR Testing, REMOVE while deploying 
        uv.allowedAmount = amount;
        uv.redeemedMilestones = 0;
        userVault[user] = uv;
    }
    
    // ----------------------------------------------------------------------------
    //
    // FOR Testing ONLY! Remove below methods while deploying
    //
    // ----------------------------------------------------------------------------
    
    function availableMilestones() public view returns(uint) {
        uint interval = (now - userVault[msg.sender].lastMilestone) / 30 days;
        return interval - userVault[msg.sender].redeemedMilestones;
    }
    
    function withdrawableBalance() public view returns(uint) {
        return (availableMilestones() * userVault[msg.sender].allowedAmount) * 10 / 100;
    }
    
    function lastMilestone() public view returns(uint) {
        return userVault[msg.sender].lastMilestone;
    }
    
    function allowedAmount() public view returns(uint) {
        return userVault[msg.sender].allowedAmount;
    }
    
    function timenow() public view returns(uint) {
        return now;
    }
    
}
